const mongoose = require('mongoose');

const initializeDatabase = () => {
  mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;
  
  db.on("error", (error) => {
    console.error("Database connection error:", error);
  });
  
  db.once("connected", () => {
    console.log("Database connected");
  });
}

module.exports = initializeDatabase;
