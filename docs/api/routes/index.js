const express = require("express");
const router = express.Router();
const { expressjwt: jwt } = require("express-jwt");
const auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: "payload",
  algorithms: ["HS256"],
});
const ctrlToil = require("../controllers/Toilets");
const ctrlUsr = require("../controllers/User");
const ctrlAuth = require("../controllers/Auth");
const ctrlComments = require("../controllers/Comments");

// Forms
// auth deleted for testing
router.route("/toilets").get(ctrlToil.getToilets).post(ctrlToil.newToilet);

router
  .route("/toilets/:toiletId")
  .put(ctrlToil.updateToilet)
  .delete(ctrlToil.deleteToilet);

router.delete("/deleteAllToilets", ctrlToil.deleteToilets);

// Users
router.route("/users").get(ctrlUsr.getUsers).post(ctrlUsr.newUser);

router
  .route("/users/:userId")
  .get(ctrlUsr.getUserById)
  .put(ctrlUsr.updateExperience)
  .delete(ctrlUsr.deleteUser);

router.get("/users/mail/:mail", ctrlUsr.getUserByMail);

router.delete("/deleteAllUsers", ctrlUsr.deleteUsers);

// Auth
router.post("/register", ctrlAuth.register);
router.post("/login", ctrlAuth.login);

// Comments
router
  .route("/comments")
  .get(ctrlComments.commentsReadAll)
  .post(auth, ctrlComments.doAddComment);

router
  .route("/comments/:commentid")
  .get(ctrlComments.commentsReadOne)
  .put(auth, ctrlComments.commentsUpdateOne)
  .delete(auth, ctrlComments.commentsDeleteOne);

router.delete("/deleteAllComments", ctrlComments.deleteComments);



module.exports = router;
