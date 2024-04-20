const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const UserModel = mongoose.model("users");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (username, password, cbDone) => {
      try {
        let user = await UserModel.findOne({ email: username });
        if (!user)
          return cbDone(null, false, { message: "E-naslov ne obstaja." });
        else if (!user.validPassword(password))
          return cbDone(null, false, { message: "Napačno geslo." });
        else return cbDone(null, user);
      } catch (err) {
        return cbDone(err);
      }
    }
  )
);
