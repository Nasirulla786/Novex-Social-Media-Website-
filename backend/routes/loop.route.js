import express from "express"
import { isAuth } from "../middleware/isAuth.js";
import { upload } from "../middleware/multer.js";
import { Comment, getAllLoops, Like, uploadLoop } from "../controllers/loop.controller.js";
const loopRouter = express.Router();

loopRouter.post("/uploadloop",isAuth ,upload.single("media"),uploadLoop);
loopRouter.get("/getloops",isAuth,getAllLoops);
loopRouter.get("/like/:loopID",isAuth,Like);
loopRouter.post("/comment/:loopID",isAuth,Comment);

export default loopRouter;
