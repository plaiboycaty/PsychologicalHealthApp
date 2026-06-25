const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const treatmentHelper = require('../utils/treatmentHelper');

const userController = {
  getProfile: async (req, res, next) => {
    try {
      const userId = req.user.user_id;
      const user = await userModel.getUserById(userId);

      if (!user) {
        return res.status(404).json({ message: 'Không tìm thấy thông tin người dùng' });
      }

      const { password_hash, ...safeUserData } = user;

      const treatment_status = await treatmentHelper.getTreatmentStatus(userId);
      safeUserData.treatment_status = treatment_status;

      res.status(200).json({
        message: 'Lấy thông tin cá nhân thành công',
        data: safeUserData
      });
    } catch (error) {
      next(error);
    }
  },

  updateProfile: async (req, res, next) => {
    try {
      const userId = req.user.user_id;
      const { full_name, gender, dob, avatar_url } = req.body;

      if (req.body.email) {
        return res.status(400).json({ message: 'Không được phép thay đổi Email đăng nhập' });
      }

      const rowsAffected = await userModel.updateProfile(userId, {
        full_name: full_name || null,
        gender: gender || null,
        dob: dob || null,
        avatar_url: avatar_url || null
      });

      res.status(200).json({ message: 'Cập nhật hồ sơ cá nhân thành công' });
    } catch (error) {
      next(error);
    }
  },

  changePassword: async (req, res, next) => {
    try {
      const userId = req.user.user_id;
      const { old_password, new_password } = req.body;

      if (!old_password || !new_password) {
        return res.status(400).json({ message: 'Vui lòng cung cấp mật khẩu cũ và mật khẩu mới' });
      }

      const user = await userModel.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: 'Không tìm thấy tài khoản người dùng' });
      }

      const isMatch = await bcrypt.compare(old_password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ message: 'Mật khẩu cũ không chính xác!' });
      }

      const salt = await bcrypt.genSalt(10);
      const newPasswordHash = await bcrypt.hash(new_password, salt);

      await userModel.updatePassword(userId, newPasswordHash);

      res.status(200).json({ message: 'Đổi mật khẩu thành công!' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = userController;
