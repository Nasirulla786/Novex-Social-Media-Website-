import sendMail from "../config/mail.js";
import { generateToken } from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const singUp = async (req, res) => {
  try {
    const { userName, name, email, password, profileImage } = req.body;

    if (!userName || !name || !email || !password) {
      return res.status(400).json({ message: "Input Field is empty...!" });
    }

    const existingEmail = await User.findOne({ email: email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exsist...!" });
    }

    const existingUserName = await User.findOne({ userName: userName });
    if (existingUserName) {
      return res.status(400).json({ message: "UserName already exsist...!" });
    }

    if (password.length < 5) {
      return res
        .status(400)
        .json({ message: "Password must be minimum 6 charcter...!" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      userName: userName,
      name: name,
      email: email,
      password: hashPassword,
      profileImage: profileImage,
    });

    let token;
    try {
      token = await generateToken(newUser._id);
    } catch (error) {
      console.log("token error", error);
    }

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 10 * 365 * 24 * 60 * 60 * 1000,
      secure: false,
      sameSite: "Strict",
    });

    return res.status(200).json({ message: "User Signup successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "SignUp Error" });
  }
};

export const LogIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Input Field is empty...!" });
    }

    const existingEmail = await User.findOne({ email: email });
    if (!existingEmail) {
      return res.status(400).json({ message: "Email does not exist..!" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingEmail.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid password...!" });
    }

    const ExistingUser = await User.findOne({
      email: email,
    });

    let token;
    try {
      token = await generateToken(ExistingUser._id);
    } catch (error) {
      console.log("token error", error);
    }

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 10 * 365 * 24 * 60 * 60 * 1000,
      secure: false,
      sameSite: "Strict",
    });

    return res.status(200).json({ message: "User Login successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "SignUp Error" });
  }
};

export const Logout = (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ messagge: "logout SuccessFully" });
  } catch (error) {
    console.log(error);
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {return res.status(400).json({ message: "User not found" });}

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    user.resetOTP = otp;
    user.expireOTP = Date.now() + 5 * 60 * 1000;
    user.isOTPverified = false;

    await user.save();
    await sendMail(email, otp);
    return res.status(200).json({ message: "OTP sent..!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, OTP } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.resetOTP !== OTP || user.expireOTP < Date.now()) {
      return res.status(400).json({ message: "OTP Wrong..!" });
    }

    user.isOTPverified = true;
    user.resetOTP = undefined;
    user.expireOTP = undefined;

    await user.save();
    return res.status(200).json({ message: "OTP Verifed..!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user){ return res.status(400).json({ message: "User not found" });}

    const hashPassword = await bcrypt.hash(password, 10);
    user.password = hashPassword;
    user.isOTPverified = false;
    await user.save();
    return res.status(200).json({ message: "Password Changed..!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
