import uploadCloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js";

export const getCurrentUser = async (req, res) => {
  try {
    const userID = req.userId;
    if (!userID) return res.status(401).json({ message: "Not authenticated" });

    const user = await User.findById(userID).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const SuggesstedUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.userId } }).select(
      "-password"
    );
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const editProfile = async (req, res) => {
  try {
    const { name, userName, bio, profession, profileImage } = req.body;
    const user = await User.findById(req.userId);

    if (!user) return res.status(400).json({ message: "User not found" });

    const sameNameWithUserName = await User.findOne({ userName }).select(
      "-password"
    );
    if (
      sameNameWithUserName &&
      sameNameWithUserName._id.toString() !== req.userId
    ) {
      return res.status(400).json({ message: "Username already exists" });
    }

    let editprofileImage = user.profileImage;

    if (req.file) {
      editprofileImage = await uploadCloudinary(req.file.path);
    }

    user.name = name;
    user.userName = userName;
    user.bio = bio;
    user.profession = profession;
    user.profileImage = editprofileImage;

    console.log("this is users", user.profileImage);

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const params = req.params.username;
    // console.log(params)
    const user = await User.findOne({ userName: params }).select("-password");
    console.log(user);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};




export const follow = async (req, res) => {
  try {
    const currentUserID = req.userId;
    const targetUserID = req.params.targetUserID;
    // console.log(targetUserID ,"and" ,  currentUserID)

    if (!currentUserID) {
      return res.status(400).json({ message: "User not found..!" });
    }
    if (!targetUserID) {
      return res.status(400).json({ message: "Follower not found..!" });
    }

    const targetUser = await User.findById(targetUserID);
    const currentUSer = await User.findById(currentUserID);

    // console.log(targetUser ,"and" ,  currentUSer)

    const alreadyFollow = currentUSer.following.includes(targetUserID);

    if (alreadyFollow) {
      currentUSer.followers = currentUSer.followers.filter(
        (id) => id.toString() != targetUserID.toString()
      );

      targetUser.following = targetUser.following.filter(
        (id) => id.toString() != currentUserID
      );

      await currentUSer.save();
      await targetUser.save();

      return res
        .status(200)
        .json({ message: "unfollow successfully..!", following: false });
    } else {
      targetUser.followers.push(currentUserID);
      currentUSer.following.push(targetUserID);
        await currentUSer.save();
      await targetUser.save();
          return res
        .status(200)
        .json({ message: "follow successfully..!", following: true });
    }
  } catch (error) {
    console.log(error);
  }
};



export const Search = async (req, res) => {
  try {
    const keyword = req.query.keyword;

    if (!keyword) {
      return res.status(400).json({ message: "Required Input" });
    }

    const user = await User.find({
      $or: [
        { userName: { $regex: keyword, $options: "i" } },
        { name: { $regex: keyword, $options: "i" } },
      ],
    }).select("-password");

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};
