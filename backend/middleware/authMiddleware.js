exports.protect = (req, res, next) => {
  const sessionUser = req.session?.user;
  if (!sessionUser?.id) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  req.user = sessionUser;
  next();
};
