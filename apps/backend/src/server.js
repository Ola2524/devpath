import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

// Start
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});