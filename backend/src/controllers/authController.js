const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const treatmentHelper = require('../utils/treatmentHelper');

const authController = {
  register: async (req, res, next) => {
    try {
      const { full_name, email, password, gender, dob } = req.body;

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

      const existingUser = await userModel.findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email này đã được sử dụng!' });
      }

      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);

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
      next(error);
    }
  },

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

      const user = await userModel.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' });
      }

      const payload = {
        user_id: user.id,
        email: user.email,
        role: user.role || 'user'
      };
      
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '365d' });
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
