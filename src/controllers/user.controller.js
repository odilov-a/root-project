const bcrypt = require("bcrypt");
const User = require("../models/User.js");
const { sign } = require("../utils/jwt.js");

exports.registerUser = async (req, res) => {
  try {
    const { password, ...otherData } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({
      ...otherData,
      password: hashedPassword,
    });
    await user.save();
    return res.status(201).json({ data: user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = sign({
      id: user._id,
      role: user.role,
      username: user.username,
      createdAt: user.createdAt,
    });
    return res.status(200).json({
      data: {
        token,
        role: user.role,
        username: user.username,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
