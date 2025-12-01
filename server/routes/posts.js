import express from "express";
import Post from "../models/Post.js";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Create a post
router.post("/", auth, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: "Post content is required" });
    }

    const post = new Post({
      content: content.trim(),
      author: req.user.id,
    });

    await post.save();

    // Update user's post count
    await User.findByIdAndUpdate(req.user.id, { $inc: { postsCount: 1 } });

    const populatedPost = await Post.findById(post._id)
      .populate("author", "username")
      .populate("likes", "username");

    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all posts (feed)
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username")
      .populate("likes", "username")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get posts from followed users
router.get("/feed", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const followingIds = user.following;

    // Include user's own posts and posts from followed users
    const posts = await Post.find({
      author: { $in: [...followingIds, req.user.id] },
    })
      .populate("author", "username")
      .populate("likes", "username")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a post
router.put("/:id", auth, async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    post.content = content.trim();
    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate("author", "username")
      .populate("likes", "username");

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a post
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Post.findByIdAndDelete(req.params.id);

    // Update user's post count
    await User.findByIdAndUpdate(req.user.id, { $inc: { postsCount: -1 } });

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Like/Unlike a post
router.post("/:id/like", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isLiked = post.likes.includes(req.user.id);

    if (isLiked) {
      // Unlike
      post.likes = post.likes.filter((like) => like.toString() !== req.user.id);
      post.likesCount = Math.max(0, post.likesCount - 1);
    } else {
      // Like
      post.likes.push(req.user.id);
      post.likesCount = post.likesCount + 1;
    }

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate("author", "username")
      .populate("likes", "username");

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
