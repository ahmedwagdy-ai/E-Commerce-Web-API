const httpStatusText = require("../utils/httpStatusText");

module.exports = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.currentUser.role)) {
      res.status(404).json({
        status: httpStatusText.ERROR,
        data: {
          message: "You are not authorized to perform this action!",
        },
      });
      return;
    }
    next();
  };
};
