const User = require("../models/User");
const { createSecretToken } = require("../utils/SecretToken");
const bcrypt = require("bcrypt");

module.exports.Signup = async (req, res, next) => {
  try {
    const { email, fullname, password, imgurl } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "Email already exists" });
    }
    const user = await User.create({
      ...req.body,
      email,
      fullname,
      password,
      imgurl,
    });
    const token = createSecretToken(user._id, user.isCompany);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res
      .status(201)
      .json({ message: "User signed up successfully", success: true, user });
    next();
  } catch (error) {
    console.error(error);
  }
};

module.exports.Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "Incorrect password or email" });
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.json({ message: "Incorrect password or email" });
    }
    const token = createSecretToken(user._id, user.isCompany);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res.status(201).json({
      message: "User logged in successfully",
      success: true,
      user_name: user.fullname,
      is_company: user.isCompany,
      img_url: user.imgUrl,
    });
    next();
  } catch (error) {
    console.error(error);
  }
};