const express = require("express");
const router = express.Router();
const GroupModel = require("../../models/groupModel")

router.delete("/deleteGroup", async (req, res) => {
    try {
        const { groupId } = req.body
        // Use Mongoose to find and remove 
        const deletedGroup = await GroupModel.findByIdAndRemove(groupId);
        if (deletedGroup) {
            res.json({ success: true, message: 'Group deleted successfully' });
        }
        else {
            res.status(404).json({ success: false, message: 'Group not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message, status: "error" });
    }
})

router.delete("/removeMember", async (req, res) => {
    try {
        const { groupId, userId, adminId } = req.body
        const group = await GroupModel.findOne({ _id: groupId, admins: adminId, members: userId })
        if (group === null) {
            return res.status(400).json({ message: "Group does not exist or  User is not admin of group or User is not member of group", status: "error" });
        }
        else {
            for (const key in group["members"]) {
                if (group["members"][key]._id.toString() === userId) {
                    await group.updateOne({ $pull: { members: userId } })
                    res.status(200).json({ message: "successfully removed a member from group", status: "success" });
                }
            }
        }

    } catch (error) {
        res.status(400).json({ message: error.message, status: "error" });
    }
})

module.exports = router;