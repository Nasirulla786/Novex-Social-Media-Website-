import express from "express"
import { LogIn, Logout, resetPassword, sendOtp, singUp, verifyOtp } from "../controllers/auth.controller.js";
const authRouter = express.Router();


authRouter.post("/signup",singUp)
authRouter.post("/login",LogIn)
authRouter.post("/sendotp",sendOtp)
authRouter.post("/verifyotp",verifyOtp)
authRouter.post("/resetpassword",resetPassword)
authRouter.get("/logout",Logout)

export default authRouter
