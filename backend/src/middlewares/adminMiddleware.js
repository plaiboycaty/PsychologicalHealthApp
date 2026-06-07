const adminMiddleware = (req, res, next) => {
  // req.user được gán từ authMiddleware trước đó
  if (req.user && req.user.role === 'admin') {
    next(); // Là admin -> Cho phép thực thi API
  } else {
    return res.status(403).json({ 
      status: 403,
      message: '⛔ Quyền truy cập bị từ chối! Chỉ Quản trị viên (Admin) mới được phép thực hiện hành động này.' 
    });
  }
};

module.exports = adminMiddleware;
