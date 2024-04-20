const passport = require("passport");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const UserModel = mongoose.model("users");

const register = async (req, res) => {
  if (
    !req.body.username ||
    !req.body.email ||
    !req.body.password
  ) {
    return res.status(400).json({ message: "Vsa polja so obvezna!" });
  }
  try {
    const user = req.body;
    let exists = await UserModel.find({ email: req?.body?.email });
    if (exists.length != 0) {
      res.status(409).json({ message: "E-naslov je že v uporabi." });
    } else {
      const newUser = new UserModel();
      newUser.username = user.username
      newUser.email = user.email;
      newUser.setPassword(user.password);
      await newUser.save();
      res.status(200).json({ token: newUser.generateJwt() });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const login = (req, res) => {
  if (!req.body.email || !req.body.password)
    return res.status(400).json({ message: "Vsa polja so obvezna!" });
  else
    passport.authenticate("local", (err, user, info) => {
      if (err) return res.status(500).json({ message: err.message });
      if (user) {
        return res.status(200).json({ token: user.generateJwt() });
      } else return res.status(401).json({ message: info.message });
    })(req, res);
};

module.exports = {
  register,
  login,
};
