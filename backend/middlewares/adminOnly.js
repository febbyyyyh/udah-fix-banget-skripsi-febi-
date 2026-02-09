export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "User belum terautentikasi"
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Akses ditolak, hanya admin"
    });
  }

  next();
};
