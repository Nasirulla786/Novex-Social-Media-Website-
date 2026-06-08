import express from "express";
import { ConnectDb } from "./config/db.js";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import postRouter from "./routes/post.route.js";
import loopRouter from "./routes/loop.route.js";
import storyRouter from "./routes/story.route.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post",postRouter);
app.use("/api/loop",loopRouter);
app.use("/api/story",storyRouter);

app.listen(port, () => {
  ConnectDb();
  console.log(`✅ Server running on ${port}`);
});
