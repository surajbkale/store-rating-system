const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: "Unauthorized. No user logged in.",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Forbidden. Access denied for this role",
      });
    }

    next();
  };
};

module.exports = authorizeRoles;
