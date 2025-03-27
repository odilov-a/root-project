const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const mongoSanitize = require("express-mongo-sanitize");

dotenv.config();
const router = require("./src/routes/router.js");

const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const app = express();
app.use(express.json());
app.use(cors());
app.use(mongoSanitize());
app.use("/api", router);

app.get("/", (req, res) => {
  return res.json({ message: `API is running` });
});

function server(port) {
  const listen = app.listen(port, "0.0.0.0", async () => {
    await connectDB();
    console.log(`API is running on port ${port}`);
  });
}

server(process.env.PORT);
