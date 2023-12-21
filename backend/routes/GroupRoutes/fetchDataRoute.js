const express = require("express");
const router = express.Router();
const GroupModel = require("../../models/groupModel");
const UserModel = require("../../models/userModel");
const {mongo} = require("mongoose");
const mongoose = require("mongoose");

router.get("/fetchGroupChatRecords", async (req, res) => {
    try {
        const { userId, groupId } = req.query; // Change to req.query
        const requestGroup = await GroupModel.findOne({ _id: groupId, members: userId }).select([
            "_id",
            "name",
            "members",
            "messages"
        ]);

        if (requestGroup) {
            return res.status(200).json({ ...requestGroup._doc, status: "success" });
        } else {
            res.status(404).json({ message: "Group not found or user not in the group", status: "error" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message, status: "error" });
    }
});


router.get("/fetchJoinedGroup", async (req, res) => {
    // console.log("anything income")

    try {
        const { userId } = req.query
        const groups = await GroupModel.find({ members: userId }).select([
            "_id",
            "name",
        ])
        if (groups.length === 0) {
            return res.status(200).json({ groups: [], status: "success" });
        }
        res.status(200).json({ groups: groups, status: "success" });
    } catch (error) {
        res.status(400).json({ message: error.message, status: "error" });
    }

})


router.get("/getAllGroupMembers", async (req,res) =>{
    try{
        const {groupId} = req.query
        const group = await GroupModel.findOne({_id: groupId}).populate("members").select("members");
        // console.log(group)
        if(!group){
            return res.status(404).json({message: "Group does not exist", status: "error"});
        }
        res.status(200).json({members: group.members, status: "success"});
    }catch(error) {
        // console.log(error.message)
        res.status(400).json({message: error.message, status: "error"});
    }
})


router.get("/getUserIdByName", async (req,res) =>{
    try{
        const {username} = req.query
        const user = await UserModel.findOne({username: username}).select([
            "_id"
        ])

        if (!user) {
            return res.status(404).json({ message: "User does not exist", status: "error" });
        }
        res.status(200).json({ _id: user._id, status: "success" });
    } catch (error) {
        res.status(400).json({ message: error.message, status: "error" });
    }
})

router.get("/getGroupIdByName", async (req, res) => {
    try {
        const { groupname } = req.query
        // console.log(groupname)
        const group = await GroupModel.findOne({ name: groupname }).select("_id");

        if (!group) {
            return res.status(404).json({ message: "Group does not exist", status: "error" });
        }
        res.status(200).json({ _id: group._id, status: "success" });
    } catch (error) {
        res.status(400).json({ message: error.message, status: "error" });
    }
})

router.get("/getGroupMembers", async (req, res) => {
    try {
        const { groupid } = req.query;

        const group = await GroupModel.findOne({ _id: groupid })
            .populate({
                path: 'members',
                select: 'username avatarImage _id'
            });

        if (!group) {
            return res.status(404).json({ message: "Group does not exist", status: "error" });
        }

        const memberDetails = group.members.map(member => ({
            username: member.username,
            avatarImage: member.avatarImage,
            _id: member._id
        }));

        res.status(200).json({ members: memberDetails, status: "success" });
    } catch (error) {
        res.status(400).json({ message: error.message, status: "error" });
    }
});

module.exports = router;