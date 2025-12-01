import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="container">
      <div className="card" style={{ textAlign: "center", marginTop: "4rem" }}>
        <h1
          style={{ fontSize: "3rem", marginBottom: "1rem", color: "#1da1f2" }}
        >
          Welcome to MicroBlog
        </h1>
        <p style={{ fontSize: "1.25rem", marginBottom: "2rem", color: "#666" }}>
          Share your thoughts with the world in 280 characters or less!
        </p>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link to="/register" className="btn btn-primary">
            Join Today
          </Link>
          <Link to="/login" className="btn btn-secondary">
            Already have an account?
          </Link>
        </div>

        <div style={{ marginTop: "3rem", textAlign: "left" }}>
          <h3 style={{ marginBottom: "1rem", color: "#333" }}>Features:</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li
              style={{ padding: "0.5rem 0", borderBottom: "1px solid #f0f0f0" }}
            >
              ✨ Share quick thoughts and updates
            </li>
            <li
              style={{ padding: "0.5rem 0", borderBottom: "1px solid #f0f0f0" }}
            >
              👥 Follow friends and interesting people
            </li>
            <li
              style={{ padding: "0.5rem 0", borderBottom: "1px solid #f0f0f0" }}
            >
              ❤️ Like and interact with posts
            </li>
            <li
              style={{ padding: "0.5rem 0", borderBottom: "1px solid #f0f0f0" }}
            >
              📱 Clean, simple, and mobile-friendly
            </li>
            <li style={{ padding: "0.5rem 0" }}>
              🔒 Secure user authentication
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Home;
