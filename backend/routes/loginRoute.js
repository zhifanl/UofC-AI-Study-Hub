const express = require("express");
const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const auth = require("../auth/auth");

router.get("/auth-endpoint", auth, (req, res) => {
    res.json({ message: "You are authorized to access me" });
  });
  
const generateToken = (user) => jwt.sign(
  { userId: user._id, userEmail: user.email },
  "RANDOM-TOKEN",
  { expiresIn: "24h" }
);

router.post("/login", async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send({ message: "Email not found", status: "error" });
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send({ message: "Passwords does not match", status: "error" });
    }

    const token = generateToken(user);
    res.status(200).send({
      message: "Login Successful",
      email: user.email,
      username: user.username,
      _id: user._id,
      status: "success",
      isAvatarImageSet: user.isAvatarImageSet,
      avatarImage: user.avatarImage,
      token,
    });
  } catch (error) {
    res.status(500).send({ message: "Server error", status: "error", error });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if (await UserModel.findOne({ email })) {
      return res.json({ message: "Email already used", status: "error" });
    }
    if (await UserModel.findOne({ username })) {
      return res.json({ message: "Username already used", status: "error" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({ username, email, password: hashedPassword });
    const savedUser = await user.save();
    res.status(200).json({ ...savedUser.toObject(), status: "success" });
  } catch (error) {
    res.status(400).json({ message: error.message, status: "error" });
  }
});

module.exports = router;
