import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import { upload } from "../middleware/multer.js";
// import Story from "../models/story.model.js";
import { CreateStory, getAllFollowersStories, getStoryByUserName, viewStory } from "../controllers/strory.controller.js";
const storyRouter = express.Router();

storyRouter.post("/uploadstory",isAuth , upload.single("media"),CreateStory)
storyRouter.get("/getbyusername/:username",isAuth ,getStoryByUserName)
storyRouter.get("/view/:storyID",isAuth ,viewStory)
storyRouter.get("/followerstory",isAuth ,getAllFollowersStories)



export default storyRouter
