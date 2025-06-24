import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import AuthRoutes from "./routes/authRoutes";
import MessageRoute from "./routes/messages";
const app = express();
app.use(express.json());
const PORT = 8080;
app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello, world!");
});
app.use("/auth", AuthRoutes);
app.use("/message", MessageRoute);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
