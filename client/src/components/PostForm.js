import React, { useState } from "react";

function PostForm({ onPostCreated, user }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      setError("Please write something!");
      return;
    }

    if (content.length > 280) {
      setError("Post is too long! Maximum 280 characters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        const newPost = await response.json();
        setContent("");
        onPostCreated(newPost);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to create post");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="card">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <textarea
            className="form-textarea"
            placeholder="What's happening?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={280}
            disabled={loading}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "0.5rem",
            }}
          >
            <small style={{ color: content.length > 280 ? "#e74c3c" : "#666" }}>
              {content.length}/280
            </small>
            <button
              type="submit"
              className="btn btn-primary btn-small"
              disabled={loading || !content.trim()}
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
}

export default PostForm;
