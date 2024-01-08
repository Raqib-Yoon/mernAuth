const User = require("../models/user");

exports.read = async (req, res) => {
  const userId = req.params.id;

  await User.findById(userId)
    .then((user) => {
      user.salt = undefined;
      user.hashed_password = undefined;

      return res.json({
        user,
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error: "user not found.",
      });
    });
};
