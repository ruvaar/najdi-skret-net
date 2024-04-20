//to start nodemon -> npx nodemon server.js
// http://localhost:8080/index.html

const express = require('express')
const path = require('path')
const cors = require('cors')
const passport = require("passport");

const server = express();
const port = 8080;
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use(express.static(path.join(__dirname, "angular", "build")));
server.use(express.static(path.join(__dirname, "api", "images")));

server.use(passport.initialize());

require('dotenv').config();
require("./api/models/db.js");
require("./api/config/passport");

var indexRouter = require('./api/routes/index');
server.use('/api', indexRouter);

server.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "angular", "build", "index.html"));
});

server.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError")
    res.status(401).json({ message: err.message });
});

server.listen(port, ()=> {
    console.log("Server is running on port " + port);
});

module.exports = server;