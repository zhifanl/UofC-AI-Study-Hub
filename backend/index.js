require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require('mongoose');
const loginRoutes = require("./routes/loginRoute");
const setAvatarRoute = require("./routes/setAvatarRoute");
const openaiRoutes = require('./routes/openaiRoutes');
const chatRoutes = require('./routes/chatRoutes');
const fetchGroupDataRoutes = require('./routes/GroupRoutes/fetchDataRoute');
const insertGroupDataRoutes = require('./routes/GroupRoutes/insertDataRoute');
const uploadAudioRoute = require('./routes/uploadVoiceMessageRoute')
const deleteDataRoutes = require('./routes/GroupRoutes/deleteDataRoute');

const initializeDatabase = require('./db/db');
const app = express();

// middlewares
app.use(express.json());
app.use(cors());  // Enable CORS for all routes and origins

// routes will go here
app.use("/api", loginRoutes, setAvatarRoute, chatRoutes);
app.use('/openai', openaiRoutes);
app.use("/fetchGroupData", fetchGroupDataRoutes)
app.use("/insertGroupData", insertGroupDataRoutes)
app.use("/uploadAudio", uploadAudioRoute)
app.use("/deleteGroupData", deleteDataRoutes)

// Mongo DB init
initializeDatabase();

// express server
const server = app.listen(process.env.MY_PORT, () => {
  console.log(`Server running on Port ${process.env.MY_PORT}.`);
});

// shutdown logic
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
    mongoose.connection.close(false, () => {
      console.log('MongoDb connection closed');
      process.exit(0);
    });
  })
});

const socket = require("socket.io");

const io = socket(server, {
  cors: {}
});

global.onlineUsers = new Map();
global.groupMembers = new Map(); // New map to track group members

io.on("connection", (socket) => {
  console.log("A user connected");
  console.log(socket.id);
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    // console.log("New user added.");
  });
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    // console.log(data);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-receive", data);
    }
  });


  socket.on("join-group", (groupId, userId) => {
    if (!groupMembers.has(groupId)) {
      groupMembers.set(groupId, new Set());
    }
    groupMembers.get(groupId).add(userId);

    onlineUsers.set(userId, socket.id);
  });

  socket.on('join-group', (groupId, userId) => {
    // console.log(`User ${userId} joined group ${groupId}`);

    if (!groupMembers.has(groupId)) {
      groupMembers.set(groupId, new Set());
    }
    groupMembers.get(groupId).add(userId);

    onlineUsers.set(userId, socket.id);
    socket.join(groupId); // Joining the socket.io room for group
    // console.log(`Socket joined ${groupId}`)
  });


  socket.on('send-group-msg', (data) => {
    // console.log(`Message sent in group ${data.groupId} by user ${data.senderId}`);

    // Broadcast to all users in the group
    socket.to(data.groupId).emit('group-msg-receive', {
      senderId: data.senderId,
      text: data.content,
      groupId: data.groupId
    });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
    console.log(socket.id);
  })
});

