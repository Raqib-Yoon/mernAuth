const User = require("../models/user");

exports.read = async (req, res) => {
  const userId = req.params.id;

  await User.findById(userId)
    .then((user) => {
      user.salt = undefined;

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

// for updating user info
exports.update = async (req, res) => {
  const { name, password } = req.body;
  try {
    const user = await User.findById(req.userId);

    if (!name) {
      return res.status(400).json({
        error: "Name is required",
      });
    } else {
      user.name = name;
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        error: "password must be at least 6 character long.",
      });
    } else {
      user.password = password;
      user.save();
    }

    
    return res.json({
      user,
      message: "user updated successfully...",
    });
  } catch (error) {
    return res.status(400).json({
      error: "user not found",
    });
  }
};
