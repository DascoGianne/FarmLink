exports.requireBuyer = (req, res, next) => {
  if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });
  if (req.user.role !== "BUYER") {
    return res.status(403).json({ success: false, message: "Buyer access only" });
  }
  next();
};

exports.requireNgo = (req, res, next) => {
  if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });
  if (req.user.role !== "NGO") {
    return res.status(403).json({ success: false, message: "NGO access only" });
  }
  next();
};
