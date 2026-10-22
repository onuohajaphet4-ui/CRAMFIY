const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/Users.js");
const noteRoutes = require("./routes/Note.js");

const connectDB = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Cramify backend is running 🚀",
  });
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Cramify server running on port ${PORT}`);
  });
};

startServer();