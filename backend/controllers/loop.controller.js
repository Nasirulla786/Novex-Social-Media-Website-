import uploadCloudinary from "../config/cloudinary.js";
import Loop from "../models/loop.model.js";
import User from "../models/user.model.js";

export const uploadLoop = async (req, res) => {
  try {
    const { caption } = req.body;
    let media;
    if (req.file) {
      media = await uploadCloudinary(req.file.path);
    } else {
      return res.status(400).json({ message: "Media is reqquired" });
    }

    const loop = await Loop.create({
      caption,
      media,
      author: req.userId,
    });

    const user = await User.findById(req.userId);
    user.loops.push(loop._id);

    const populatedLoop = await Loop.findById(loop._id).populate(
      "author",
      "name userName profileImage"
    );

    await user.save();

    return res.status(200).json(populatedLoop);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const getAllLoops = async (req, res) => {
  try {
    const loops = await Loop.find({}).populate(
      "author",
      "name userName profileImage"
    );
    return res.status(200).json(loops);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const Like = async (req, res) => {
  try {
    const loopID = req.params.loopID;
    const loop = await Loop.findById(loopID);

    if (!loop) {
      return res.status(400).json({ message: "loop not found" });
    }

    const alreadyLike = loop.like.some(
      (id) => id.toString() == req.userId.toString()
    );

    if (alreadyLike) {
      loop.like = loop.like.filter(
        (id) => id.toString() != req.userId.toString()
      );
    } else {
      loop.like.push(req.userId);
    }

    await loop.populate("author", "name userName profileImage");

    await loop.save();

    return res.status(200).json(loop);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const Comment = async (req, res) => {
  try {
    const loopId = req.params.loopID;
    const { message } = req.body;

    const loop = await Loop.findById(loopId);
    if (!loop) {
      return res.status(400).json({ message: "Loop not found" });
    }

    loop.comments.push({
      author: req.userId,
      message,
    });

    await loop.save();

    // ✅ populate after saving so the new comment is included
    await loop.populate([
      { path: "author", select: "name userName profileImage" },
      { path: "comments.author", select: "name userName profileImage" },
    ]);

    return res.status(200).json(loop);
  } catch (error) {
    console.error("Comment Error:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

