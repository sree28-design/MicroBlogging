import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Post from "../components/Post";

function Profile({ currentUser }) {
  const { username } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const [newBio, setNewBio] = useState("");

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${username}`);

      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
        setNewBio(data.user.bio || "");

        // Check if current user is following this user
        if (currentUser && data.user.followers) {
          setIsFollowing(
            data.user.followers.some(
              (follower) => follower._id === currentUser._id
            )
          );
        }
      } else {
        setError("User not found");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!currentUser) return;

    setFollowLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/users/${username}/follow`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsFollowing(data.isFollowing);

        // Update follower count
        setProfileData((prev) => ({
          ...prev,
          user: {
            ...prev.user,
            followers: data.isFollowing
              ? [...prev.user.followers, currentUser]
              : prev.user.followers.filter((f) => f._id !== currentUser._id),
          },
        }));
      }
    } catch (error) {
      console.error("Follow error:", error);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleBioUpdate = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bio: newBio }),
      });

      if (response.ok) {
        setProfileData((prev) => ({
          ...prev,
          user: { ...prev.user, bio: newBio },
        }));
        setEditingBio(false);
      }
    } catch (error) {
      console.error("Bio update error:", error);
    }
  };

  const handlePostUpdate = (updatedPost) => {
    setProfileData((prev) => ({
      ...prev,
      posts: prev.posts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      ),
    }));
  };

  const handlePostDelete = (postId) => {
    setProfileData((prev) => ({
      ...prev,
      posts: prev.posts.filter((post) => post._id !== postId),
    }));
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  const { user, posts } = profileData;
  const isOwnProfile = currentUser && currentUser.username === username;

  return (
    <div className="container">
      <div className="profile-header">
        <div className="profile-username">@{user.username}</div>

        {editingBio ? (
          <form onSubmit={handleBioUpdate} style={{ margin: "1rem 0" }}>
            <textarea
              className="form-textarea"
              value={newBio}
              onChange={(e) => setNewBio(e.target.value)}
              placeholder="Write a short bio..."
              maxLength={160}
              style={{ minHeight: "80px" }}
            />
            <div
              style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}
            >
              <button type="submit" className="btn btn-primary btn-small">
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingBio(false);
                  setNewBio(user.bio || "");
                }}
                className="btn btn-secondary btn-small"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-bio">
            {user.bio || (isOwnProfile ? "No bio yet." : "No bio.")}
            {isOwnProfile && (
              <button
                onClick={() => setEditingBio(true)}
                className="btn btn-secondary btn-small"
                style={{ marginLeft: "1rem" }}
              >
                Edit Bio
              </button>
            )}
          </div>
        )}

        <div className="profile-stats">
          <div className="stat">
            <div className="stat-number">{posts.length}</div>
            <div className="stat-label">Posts</div>
          </div>
          <div className="stat">
            <div className="stat-number">{user.followers.length}</div>
            <div className="stat-label">Followers</div>
          </div>
          <div className="stat">
            <div className="stat-number">{user.following.length}</div>
            <div className="stat-label">Following</div>
          </div>
        </div>

        {currentUser && !isOwnProfile && (
          <button
            onClick={handleFollow}
            disabled={followLoading}
            className={`btn ${isFollowing ? "btn-secondary" : "btn-primary"}`}
          >
            {followLoading ? "Loading..." : isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>

      <div>
        <h3 style={{ marginBottom: "1rem" }}>Posts by @{user.username}</h3>

        {posts.length === 0 ? (
          <div className="card">
            <p style={{ textAlign: "center", color: "#666" }}>
              {isOwnProfile
                ? "You haven't posted anything yet."
                : "No posts yet."}
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <Post
              key={post._id}
              post={post}
              currentUser={currentUser}
              onPostUpdate={handlePostUpdate}
              onPostDelete={handlePostDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Profile;
