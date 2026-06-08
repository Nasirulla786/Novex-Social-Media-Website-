import mongoose from "mongoose";
const storySchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    mediaType: {
      type: String,
      enum: ["image", "video"],
    },

    media: {
      type: String,
      required: true,
    },

    viewers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now(),
      expires: 84600, //(24*60*60*1000)
    },
  },
  { timestamps: true }
);

const Story = mongoose.model("Story", storySchema);

export default Story;
