import express from "express"
import { isAuth } from "../middleware/isAuth.js";
import { Comment, getAllpost, Like, savedPost, uploadPost } from "../controllers/post.controller.js";
import { upload } from "../middleware/multer.js";

const postRouter = express.Router();

postRouter.post("/uploadpost",isAuth, upload.single("media"), uploadPost)
postRouter.get("/getallposts",isAuth,getAllpost)
postRouter.get("/like/:postID",isAuth,Like)
postRouter.post("/comment/:postID",isAuth,Comment)
postRouter.get("/savedpost",isAuth,savedPost)

export default postRouter
