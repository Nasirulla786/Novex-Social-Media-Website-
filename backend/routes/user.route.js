import express from "express"
import { isAuth } from "../middleware/isAuth.js";
import { editProfile, follow, getCurrentUser, getProfile, Search, SuggesstedUsers } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.js";


const userRouter = express.Router();
userRouter.get("/current",isAuth,getCurrentUser);
userRouter.get("/suggest",SuggesstedUsers)
userRouter.get("/follow/:targetUserID", isAuth , follow)
userRouter.post("/editprofile",isAuth,upload.single("profileImage"), editProfile)
userRouter.get("/profile/:username",isAuth,getProfile)
userRouter.get("/search",isAuth,Search)

export default userRouter;
