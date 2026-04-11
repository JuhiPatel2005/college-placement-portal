exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // check if user's role is allowed
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    next(); // allowed → continue
  };
};