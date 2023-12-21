const express = require("express");
const router = express.Router();
const AWS = require('aws-sdk');
const multer = require('multer');
const messageModel = require("../models/messageModel");

AWS.config.update({
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_VALUE,
    region: 'us-west-2'
});

const s3 = new AWS.S3();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Function to upload a file to S3
const uploadFileToS3 = (file, newFileName) => {
    console.log(file)
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: 'seng513-uofc-study-hub',
            Key: newFileName,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read' // or other ACL according to your requirements
        };
        console.log('uploading')

        s3.upload(params, function (err, data) {
            if (err) {
                reject(err);
                console.log(err)
            } else {
                resolve(data);
                console.log('uploaded')
            }
        });
    });
};

router.post('/uploadaudio', upload.single('audio'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
        fileName = `${Date.now()}_${req.file.originalname}`
        filePath = 'https://seng513-uofc-study-hub.s3.us-west-2.amazonaws.com/'
        const result = await uploadFileToS3(req.file, fileName);
        const { from, to, duration } = req.body;
        const newMessage = await messageModel.create({
            users: [from, to],
            text: 'voice message',
            isRead: false,
            sender: from,
            recipient: to,
            audioUrl: filePath + fileName,
            duration: duration,
            type: 'voice'
        });

        res.json({
            message: "File uploaded successfully",
            data: newMessage
        });

    } catch (error) {
        console.error("Error details:", error);
        res.status(500).send({ message: "Error uploading file", error: error.message });
    }
});

module.exports = router;