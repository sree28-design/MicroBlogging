import express from "express";
import User from "../models/User.js";
import Post from "../models/Post.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Get user profile
router.get("/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select("-password")
      .populate("followers following", "username");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get user's posts
    const posts = await Post.find({ author: user._id })
      .populate("author", "username")
      .populate("likes", "username")
      .sort({ createdAt: -1 });

    res.json({
      user,
      posts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Follow/Unfollow user
router.post("/:username/follow", auth, async (req, res) => {
  try {
    const targetUser = await User.findOne({ username: req.params.username });
    const currentUser = await User.findById(req.user.id);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (targetUser._id.toString() === req.user.id) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    const isFollowing = currentUser.following.includes(targetUser._id);

    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== targetUser._id.toString()
      );
      targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() !== req.user.id
      );
    } else {
      // Follow
      currentUser.following.push(targetUser._id);
      targetUser.followers.push(req.user.id);
    }

    await currentUser.save();
    await targetUser.save();

    res.json({
      message: isFollowing
        ? "Unfollowed successfully"
        : "Followed successfully",
      isFollowing: !isFollowing,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search users
router.get("/search/:query", async (req, res) => {
  try {
    const query = req.params.query;
    const users = await User.find({
      username: { $regex: query, $options: "i" },
    })
      .select("-password")
      .limit(10);

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.put("/profile", auth, async (req, res) => {
  try {
    const { bio } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { bio: bio || "" },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
