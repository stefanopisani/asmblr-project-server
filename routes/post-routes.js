const router = require("express").Router();
const Post = require("../models/Post.model");
const fileUpload = require("../config/cloudinary");

//Get all the posts
router.get("/posts", async (req, res) => {
  try {
    console.log("request", req.session.currentUser);
    // we can protect also in the backend and if req.session.currentUser is undefined don't show posts
    const posts = await Post.find().populate("user");
    res.status(200).json(posts);
  } catch (e) {
    res.status(500).json({ message: e });
  }
});

//Create a post
router.post("/post", async (req, res) => {
    console.log("posting", req.session.currentUser);
  const { title, description, imageUrl } = req.body;

  if (!title || !description || !imageUrl) {
    res.status(400).json({ message: "missing fields" });
    return;
  }

  try {
    
    const response = await Post.create({
      title,
      description,
      imageUrl,
      user: req.session.currentUser,
    });
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ message: e });
  }
});

//Delete a post
router.delete("/posts/:id", async (req, res) => {
  try {
    await Post.findByIdAndRemove(req.params.id);
    res
      .status(200)
      .json({ message: `post with id: ${req.params.id} was deleted.` });
  } catch (e) {
    res.status(500).json({ message: e });
  }
});

//Get one specific post
router.get("/posts/:id", async (req, res) => {
  try {
    const response = await Post.findById(req.params.id).populate("user");
    console.log(response);
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

//Edit post
router.put("/posts/:id", async (req, res) => {
  const { title, description, imageUrl } = req.body;
  if (!title || !description) {
    res.status(400).json({ message: "missing fields" });
    return;
  }

  try {
    const response = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
      },
      { new: true }
    );
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

//Upload a file on cloudinary
router.post("/upload", fileUpload.single("file"), async (req, res) => {
  try {
    res.status(200).json({ fileUrl: req.file.path });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

//ALL ROUTES TESTED ON POSTMAN ✅
module.exports = router;
