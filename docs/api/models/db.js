const mongoose = require("mongoose");
var dbURI = "mongodb://127.0.0.1/";

switch (process.env.NODE_ENV) {
  case "test":
    dbURI = "mongodb://127.0.0.1/";
    mongoose.connect(dbURI);
    break;
  case "production":
    dbURI = process.env.MONGODB_URI;
    mongoose.connect(dbURI);
    break;
  default:
    console.log("Invalid NODE_ENV value");
}

mongoose.connect(dbURI);

mongoose.connection.on("connected", () =>
  console.log(`Mongoose is connected.`)
);
mongoose.connection.on("error", (err) =>
  console.log(`Mongoose connection error: ${err}.`)
);
mongoose.connection.on("disconnected", () =>
  console.log("Mongoose disconnected")
);

const gracefulShutdown = async (msg, callback) => {
  await mongoose.connection.close();
  console.log(`Mongoose disconnected through ${msg}.`);
  callback();
};

process.once("SIGUSR2", () => {
  gracefulShutdown("nodemon restart", () =>
    process.kill(process.pid, "SIGUSR2")
  );
});

process.on("SIGINT", () => {
  gracefulShutdown("app termination", () => process.exit(0));
});

process.on("SIGTERM", () => {
  gracefulShutdown("Cloud-based app shutdown", () => process.exit(0));
});

require("./User");
require("./Toilets");
require("./Comment");
