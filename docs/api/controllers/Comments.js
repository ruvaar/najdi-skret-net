const mongoose = require("mongoose");
const CommentModel = mongoose.model("comments");
const User = mongoose.model("users");
const ToiletModel = mongoose.model("toilets");

const commentsReadOne = async (req, res) => {
  try {
    const comment = await CommentModel.findById(req.params.commentid);
    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
    } else {
      res.status(200).json(comment);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const commentsReadAll = async (req, res) => {
  try {
    const comments = await CommentModel.find();
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const commentsUpdateOne = async (req, res) => {
  if (!req.params.commentid) {
    res.status(400).json({ message: "CommentId is required." });
  } else {
    try {
      const comment = await CommentModel.findById(req.params.commentid);
      if (!comment) {
        res.status(404).json({ message: "Comment not found." });
      } else {
        getAuthor(req, res, async (req, res, author) => {
          if (comment.mail !== author.email) {
            res
              .status(403)
              .json({ message: "You are not the author of this comment." });
          } else if (!req.body.comment) {
            res
              .status(400)
              .json({ message: "Body parameter 'comment' is required." });
          } else {
            comment.comment = req.body.comment;
            await comment.save();
            res.status(200).json(comment);
          }
        });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

const commentsDeleteOne = async (req, res) => {
  if (!req.params.commentid) {
    res.status(400).json({ message: "CommentId is required." });
  } else {
    try {
      const comment = await CommentModel.findById(req.params.commentid);
      if (!comment) {
        res.status(404).json({ message: "Comment not found." });
      } else {
        getAuthor(req, res, async (req, res, author) => {
          if (comment.mail !== author.email) {
            res.status(403).json({
              message: "You are not the author of this comments",
            });
          } else {
            await comment.deleteOne();
            res.status(204).send();
          }
        });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

const doAddComment = async (req, res) => {
  if (!req.body?.comment || !req.body?.toilet_id)
    res.status(400).json({
      message: "Body parameters 'comment' are required.",
    });
  else {
    try {
      getAuthor(req, res, async (req, res, author) => {
        const newComment = new CommentModel();

        newComment.username = author.username;
        newComment.comment = req.body?.comment;
        newComment.createdOn = Date.now();
        newComment.toilet_id = req.body.toilet_id;

        await newComment.save();
        res.status(201).json(newComment);
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

const getAuthor = async (req, res, cbResult) => {
  if (req.auth?.email) {
    try {
      let user = await User.findOne({ email: req.auth.email }).exec();
      if (!user) res.status(401).json({ message: "User not found" });
      else cbResult(req, res, user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else {
    res.status(401).json({ message: "User email not found." });
  }
};

var deleteComments = async (req, res) => {
  try {
    let result = await CommentModel.deleteMany({});
    if (!result) {
      res.status(404).json({ Error: "No comments found to delete." });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  doAddComment,
  commentsReadOne,
  commentsUpdateOne,
  commentsDeleteOne,
  commentsReadAll,
  deleteComments,
};
