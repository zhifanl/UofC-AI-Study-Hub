const express = require("express");
const UserModel = require("../models/userModel");
const router = express.Router();
const axios = require("axios");
const multiAvatarApiKey = process.env.MULTIAVATAR_API_KEY;

router.post("/setavatar/:id", async (req, res, next) => {
    // console.log("setAvatar is called", req)
    try {
        const userid = req.params.id;

        const avatarImage = req.body.image;

        const userData = await UserModel.findByIdAndUpdate(
            userid,

            {
                isAvatarImageSet: true,
                avatarImage,
            },
            { new: true }
        );
        return res.json({
            isSet: userData.isAvatarImageSet,
            image: userData.avatarImage,
        });
    } catch (error) {
        next(error);
    }
});


router.get('/fetchAvatars', async (req, res, next) => {
    try {
        const apiBase = `https://api.multiavatar.com/Starcrasher.svg`;
        const numberOfAvatars = 5; // Number of avatars to fetch
        const avatarPromises = [];

        for (let i = 0; i < numberOfAvatars; i++) {
            const randomId = Math.round(Math.random() * 1000);
            avatarPromises.push(axios.get(`${apiBase}/${randomId}/?apikey=${multiAvatarApiKey}`));
            console.log(`${apiBase}/${randomId}`)
        }

        const avatarResponses = await Promise.all(avatarPromises);
        const avatars = avatarResponses.map(response => Buffer.from(response.data).toString('base64'));
        
        res.json(avatars);
    } catch (error) {
        console.error("Error fetching avatars from Multiavatar:", error);
        next(error);
    }
});

module.exports = router;
