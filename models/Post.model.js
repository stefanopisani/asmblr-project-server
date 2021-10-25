const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    imageUrl: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // type: {
    //   type: String,
    //   enum: ['meme', 'gif'],
    // }
    category: {
      type: String,
      enum: ["funny", "reactions", "entertainment", "sports", "others"]
    }
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
