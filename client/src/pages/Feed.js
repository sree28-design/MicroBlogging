import React, { useState, useEffect } from "react";
import PostForm from "../components/PostForm";
import Post from "../components/Post";

function Feed({ user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState("feed"); // 'feed' or 'all'

  useEffect(() => {
    fetchPosts();
  }, [view]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const endpoint = view === "feed" ? "/api/posts/feed" : "/api/posts";

      const response = await fetch(endpoint, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      });

      if (response.ok) {
        const postsData = await response.json();
        setPosts(postsData);
      } else {
        setError("Failed to fetch posts");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(
      posts.map((post) => (post._id === updatedPost._id ? updatedPost : post))
    );
  };

  const handlePostDelete = (postId) => {
    setPosts(posts.filter((post) => post._id !== postId));
  };

  if (!user) {
    return (
      <div className="container">
        <div className="card">
          <h2>Please log in to view your feed</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <PostForm user={user} onPostCreated={handlePostCreated} />

      <div className="card">
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <button
            onClick={() => setView("feed")}
            className={`btn ${
              view === "feed" ? "btn-primary" : "btn-secondary"
            } btn-small`}
          >
            My Feed
          </button>
          <button
            onClick={() => setView("all")}
            className={`btn ${
              view === "all" ? "btn-primary" : "btn-secondary"
            } btn-small`}
          >
            All Posts
          </button>
        </div>
        <p style={{ color: "#666", fontSize: "0.875rem" }}>
          {view === "feed"
            ? "Posts from people you follow"
            : "All posts from everyone"}
        </p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="card">
          <p style={{ textAlign: "center", color: "#666" }}>
            {view === "feed"
              ? 'No posts in your feed yet. Try following some users or switch to "All Posts"!'
              : "No posts yet. Be the first to post something!"}
          </p>
        </div>
      ) : (
        posts.map((post) => (
          <Post
            key={post._id}
            post={post}
            currentUser={user}
            onPostUpdate={handlePostUpdate}
            onPostDelete={handlePostDelete}
          />
        ))
      )}
    </div>
  );
}

export default Feed;
