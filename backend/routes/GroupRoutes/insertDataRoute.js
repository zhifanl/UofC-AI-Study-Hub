const express = require("express");
const router = express.Router();
const GroupModel = require("../../models/groupModel")
router.post("/createNewGroup", async (req, res) => {
    try {
        const {name, userId} = req.body
        const group  = new GroupModel({name:name, members: userId, admins:userId})
        await group.save()
        res.status(200).json({message:"successfully create new group chat", status: "success" });
        console.log("new group created")
    } catch (error) {
        res.status(400).json({ message: error.message, status: "error" });
    }
})
router.post("/addNewGroupMember", async (req, res) => {
    try {
        const {groupId, userId, adminId } = req.body
        const group = await GroupModel.findOne({_id: groupId, admins:adminId})
        //check if admin has right to add member in group, if user has already joined in the group, and group exists
        if (group === null){
            return res.status(400).json({message:"Group does not exist or  User is not admin of group or User already is member of group", status: "error" });
        }
        else{
            for (const key in group["members"]){
                if (group["members"][key]._id.toString() === userId){
                    return res.status(200).json({message:"User already is in group ", status: "error" });
                }
            }
            await group.updateOne({$push:{members: userId}})
            return res.status(200).json({message:"successfully add a new group member", status: "success" });
        }
        //check if admin has right to add member in group
    } catch (error) {
        res.status(400).json({ message: error.message, status: "error" });
    }
})

router.post("/addNewGroupMessage", async (req, res) => {
    try {
        const {groupId, senderId, content} = req.body
        const targetGroup = await GroupModel.findOneAndUpdate({_id:groupId, members: senderId},
            {$push:{messages: [{sender:senderId, text: content}]}})
        // check if group does exist, user has joined the group
        // console.log(targetGroup)
        if (targetGroup === null){
            return res.status(400).json({message:"Group does not exist or User is not in the group", status: "error" });
        }
        res.status(200).json({message:"successfully add a new group chat message", status: "success" });
    } catch (e) {
        res.status(400).json({message: e.message, status: "error"});
    }
})

router.post("/addNewGroupAdmin", async (req, res) => {
    try {
        const {groupId, userId, adminId } = req.body
        const group = await GroupModel.findOne({_id:groupId, admins: adminId, members: userId})
        // check if group id is valid, admin has right to add, user is in the group
        if (group === null){
            return res.status(400).json({message:"Group does not exist or  User is not admin of group or User is not member of group", status: "error" });
        }
        else{
            // is user already an admins
            for (const key in group["admins"]){
                if (group["admins"][key]._id.toString() === userId){
                    return res.status(200).json({message:"User already is admin ", status: "error" });
                }
            }
            await group.updateOne({$push:{admins: userId}})
            res.status(200).json({message:"successfully add a new admin to group", status: "success" });
        }

    } catch (error) {
        res.status(400).json({ message: error.message, status: "error" });
    }
})


module.exports = router;