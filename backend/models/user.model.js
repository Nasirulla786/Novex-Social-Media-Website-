import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    profileImage: {
      type: String,
    },

    bio:{
      type:String
    },
    profession:{
         type:String

    },
    gender:{
      enum:["male","female","others"]
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],

    loops: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Loop",
      },
    ],

    story: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Story",
      },
    ],

    saved :[{
      type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    }],


    resetOTP:{
      type:String
    },
    expireOTP :{
      type:Date
    },
    isOTPverified:{
      type:Boolean,
      default:false
    }
  },

  { timeseries: true }
);

const User = mongoose.model("User", userSchema);

export default User;
