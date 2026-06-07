const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const treatmentHelper = require('../utils/treatmentHelper');

const authController = {
  // --- ĐĂNG KÝ TÀI KHOẢN ---
  register: async (req, res, next) => {
    try {
      const { full_name, email, password, gender, dob } = req.body;

      // 1. Kiểm tra đầu vào cơ bản & Định dạng (Regex)
      if (!full_name || !email || !password || !gender || !dob) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin: họ tên, email, mật khẩu, giới tính và ngày sinh' });
      }

      if (full_name.trim().length < 2) {
        return res.status(400).json({ message: 'Họ tên phải chứa ít nhất 2 ký tự!' });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Định dạng email không hợp lệ!' });
      }

      if (password.length < 6) {
        return res.status(400).json({ message: 'Mật khẩu phải chứa ít nhất 6 ký tự!' });
      }

      // 2. Kiểm tra email đã có người đăng ký chưa?
      const existingUser = await userModel.findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email này đã được sử dụng!' });
      }

      // 3. Mã hóa (Hash) mật khẩu bằng bcrypt
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);

      // 4. Lưu user mới vào Database
      const newUserId = await userModel.createUser({
        full_name,
        email,
        password_hash,
        gender: gender || 'Other',
        dob: dob || null
      });

      res.status(201).json({ 
        message: '🎉 Đăng ký tài khoản thành công',
        user_id: newUserId 
      });
    } catch (error) {
      next(error); // Chuyển lỗi tới Error Handler
    }
  },

  // --- ĐĂNG NHẬP (CẤP TOKEN) ---
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Vui lòng cung cấp email và password' });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Định dạng email không hợp lệ!' });
      }

      // 1. Tìm user trong DB theo email
      const user = await userModel.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' });
      }

      // 2. So sánh mật khẩu do user nhập với password_hash được lưu trong DB
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' });
      }

      // 3. Nếu mọi thứ đúng, tiến hành sinh chuỗi JWT (JSON Web Token)
      const payload = {
        user_id: user.id,
        email: user.email,
        role: user.role || 'user'
      };
      // Token hợp lệ trong thời gian 7 ngày
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

      // Tính toán trạng thái lộ trình điều trị
      const treatment_status = await treatmentHelper.getTreatmentStatus(user.id);

      res.status(200).json({
        message: '🔓 Đăng nhập thành công',
        token: token,
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          avatar_url: user.avatar_url,
          role: user.role || 'user',
          treatment_status: treatment_status
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;
