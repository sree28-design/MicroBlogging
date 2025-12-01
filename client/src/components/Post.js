import React, { useState } from "react";
import { Link } from "react-router-dom";

function Post({ post, currentUser, onPostUpdate, onPostDelete }) {
  const [isLiked, setIsLiked] = useState(
    post.likes.some((like) => like._id === currentUser?._id)
  );
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (!currentUser) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/posts/${post._id}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const updatedPost = await response.json();
        setIsLiked(!isLiked);
        setLikesCount(updatedPost.likesCount);
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/posts/${post._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: editContent }),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        onPostUpdate(updatedPost);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/posts/${post._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        onPostDelete(post._id);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const isAuthor = currentUser && post.author._id === currentUser._id;

  return (
    <div className="post">
      <div className="post-header">
        <div>
          <Link to={`/profile/${post.author.username}`} className="post-author">
            @{post.author.username}
          </Link>
          <div className="post-date">{formatDate(post.createdAt)}</div>
        </div>
        {isAuthor && (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn btn-secondary btn-small"
            >
              Edit
            </button>
            <button onClick={handleDelete} className="btn btn-danger btn-small">
              Delete
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleEdit}>
          <div className="form-group">
            <textarea
              className="form-textarea"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              maxLength={280}
              disabled={loading}
            />
            <div
              style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}
            >
              <button
                type="submit"
                className="btn btn-primary btn-small"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(post.content);
                }}
                className="btn btn-secondary btn-small"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="post-content">{post.content}</div>
      )}

      <div className="post-actions">
        <button
          onClick={handleLike}
          className={`like-btn ${isLiked ? "liked" : ""}`}
          disabled={!currentUser}
        >
          {isLiked ? "❤️" : "🤍"} {likesCount}
        </button>
      </div>
    </div>
  );
}

export default Post;
