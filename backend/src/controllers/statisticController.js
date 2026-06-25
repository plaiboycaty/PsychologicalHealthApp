const statisticModel = require('../models/statisticModel');

const statisticController = {
  getTestHistory: async (req, res, next) => {
    try {
      const userId = req.user.user_id;
      const period = req.query.period || 'all'; 
      
      const history = await statisticModel.getTestProgression(userId, period);
      
      res.status(200).json({
        message: 'Lấy lịch sử bài test thành công',
        period: period,
        data: history
      });
    } catch (error) {
      next(error);
    }
  },

  getEmotionStats: async (req, res, next) => {
    try {
      const userId = req.user.user_id;
      const period = req.query.period || 'week'; 
      
      const stats = await statisticModel.getEmotionCounts(userId, period);
      
      const totalDiaries = stats.reduce((sum, item) => sum + parseInt(item.count), 0);

      res.status(200).json({
        message: 'Lấy thống kê cảm xúc thành công',
        period: period,
        total: totalDiaries,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = statisticController;
