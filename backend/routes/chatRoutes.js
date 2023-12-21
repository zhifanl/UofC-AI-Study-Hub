const express = require("express");
const UserModel = require("../models/userModel");
const messageModel = require("../models/messageModel");
const router = express.Router();

router.get("/allusers/:id", async (req, res, next) => {
  try {
    const users = await UserModel.find({ _id: { $ne: req.params.id } }).select([
      "username",
      "avatarImage",
      "email",
      "_id",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
});


router.post("/getmsg", async (req, res, next) => {
  try {
    const { from, to } = req.body;

    // Update the message with the given ID, setting the 'read' flag to true
    // const updateResult = await messageModel.updateMany(
    //   {
    //     users: {
    //       $all: [from, to],
    //     },
    //   },
    //   { $set: { isRead: true } }
    // );

    const messages = await messageModel
      .find({
        users: {
          $all: [from, to],
        },
      })
      .sort({ updatedAt: 1 });

    const projectmessages = messages.map((msg) => {

      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.text,
        id: msg._id,
        duration: msg.duration,
        type: msg.type,
        audioUrl: msg.audioUrl
      };
    });
    return res.json(projectmessages);
  } catch (ex) {
    next(ex);
  }
});

router.post("/addmsg", async (req, res, next) => {
  try {
    const { from, to, message, sender } = req.body;
    const data = await messageModel.create({
      users: [from, to],
      text: message,
      sender: from,
      recipient: to,
      isRead: false,
    });
    // console.log(data)
    if (data) {
      // console.log(msg)
      return res.json({ msg: "Message added Successfully" });
    } else {
      return res.json({ msg: "Failed add message onto database" });
    }
  } catch (ex) {
    next(ex);
  }
});

module.exports = router;
