const utf8 = require("utf8-encoder");
const mongoose = require("mongoose");
const uuid = require("uuid");
const path = require("path");
const UserModel = mongoose.model("users");
const fs = require('fs');

var getUsers = async (req, res) => {
  try {
    let users = await UserModel.find({});
    if (users) {
      res.status(200).json(users);
    } else {
      res.status(400).json({ Error: "Bad request." });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUserById = async (req, res) => {
  try {
    let user = await UserModel.find({ _id: req.params.userId });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(400).json({ Error: "Bad request." });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUserByMail = async (req, res) => {
  try {
    console.log(req.params.mail)
    let user = await UserModel.find({ email: req.params.mail });
    if (user) {
      // console.log(user);
      res.status(200).json(user);
    } else {
      res.status(400).json({ Error: "Bad request." });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

var newUser = async (req, res) => {
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
      newUser.username = user.username;
      newUser.email = user.email;
      newUser.setPassword(user.password);
      await newUser.save();
      res.status(200).json({ token: newUser.generateJwt() });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// update experience
var updateExperience = async (req, res) => {
  var userId = req.params.userId;
  try {
    let existingUser = await UserModel.findById(userId).exec();
    if (!existingUser) {
      res.status(404).json({ Error: "User not found." });
    } else {
        existingUser.experience += 1; //!!
      await existingUser.save();
      res.status(200).json(existingUser);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

var deleteUser = async (req, res) => {
  var userId = req.params.userId;
  if (!userId) res.status(400).json({ Error: "Missing user ID." });
  else {
    try {
      let result = await UserModel.findByIdAndDelete(userId);
      if (!result) {
        res.status(404).json({ Error: "User not found." });
      } else {
        res.status(204).send();
      }
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

var deleteUsers = async (req, res) => {
  try {
    let result = await UserModel.deleteMany({});
    if (!result) {
      res.status(404).json({ Error: "No users found to delete." });
    } else {

      res.status(204).json({ message: "Users deleted successfully." });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getUsers,
  getUserById,
  getUserByMail,
  newUser,
  updateExperience,
  deleteUser,
  deleteUsers,
};
