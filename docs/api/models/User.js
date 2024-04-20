const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const UsersSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  hash: { type: String, required: [true, "Hash is required!"] },
  salt: { type: String, required: [true, "Salt is required!"] },
  experience: { type: Number, default: 0 },
});

UsersSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");
};

UsersSchema.methods.validPassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");
  return this.hash === hash;
};

UsersSchema.methods.generateJwt = function () { // Generira token za 7 dni... Mogoce kasneje dobro skrajsat?
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + 1);
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      exp: parseInt(expiry.getTime() / 1000),
    },
    process.env.JWT_SECRET
  );
};

const UserModel = mongoose.model("users", UsersSchema);
module.exports = UserModel;
