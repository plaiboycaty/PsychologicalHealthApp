const diaryModel = require('../models/diaryModel');

const diaryController = {
  getEmotions: async (req, res, next) => {
    try {
      const emotions = await diaryModel.getAllEmotions();
      res.status(200).json({
        message: 'Lấy danh sách cảm xúc thành công',
        data: emotions
      });
    } catch (error) {
      next(error);
    }
  },

  getMyDiaries: async (req, res, next) => {
    try {
      const userId = req.user.user_id;
      const diaries = await diaryModel.getUserDiaries(userId);
      
      res.status(200).json({
        message: 'Lấy nhật ký thành công',
        data: diaries
      });
    } catch (error) {
      next(error);
    }
  },

  addDiary: async (req, res, next) => {
    try {
      const userId = req.user.user_id;
      const { emotion_id, title, content, image_url } = req.body;

      if (!emotion_id || !title || !content) {
        return res.status(400).json({ message: 'Vui lòng cung cấp đủ emotion_id, title, content' });
      }

      const newDiaryId = await diaryModel.createDiary({
        user_id: userId,
        emotion_id,
        title,
        content,
        image_url
      });

      res.status(201).json({
        message: 'Thêm nhật ký thành công',
        diary_id: newDiaryId
      });
    } catch (error) {
      next(error);
    }
  },

  editDiary: async (req, res, next) => {
    try {
      const diaryId = req.params.id;
      const userId = req.user.user_id;
      const { emotion_id, title, content, image_url } = req.body;

      const affectedRows = await diaryModel.updateDiary(diaryId, userId, {
        emotion_id, title, content, image_url
      });

      if (affectedRows === 0) {
        return res.status(403).json({ message: 'Không tìm thấy nhật ký hoặc Bạn không có quyền sửa bài này!' });
      }

      res.status(200).json({ message: 'Cập nhật nhật ký thành công' });
    } catch (error) {
      next(error);
    }
  },

  removeDiary: async (req, res, next) => {
    try {
      const diaryId = req.params.id;
      const userId = req.user.user_id;

      const affectedRows = await diaryModel.deleteDiary(diaryId, userId);

      if (affectedRows === 0) {
        return res.status(403).json({ message: 'Không tìm thấy nhật ký hoặc Bạn không có quyền xóa bài này!' });
      }

      res.status(200).json({ message: 'Xóa nhật ký thành công' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = diaryController;
