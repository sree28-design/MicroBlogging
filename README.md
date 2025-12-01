# 🐦 MicroBlog - Simple Twitter-like App

A simple, beginner-friendly micro-blogging application built with the MERN stack (MongoDB, Express.js, React, Node.js).

## ✨ Features

- **User Authentication** - Register/Login with JWT tokens
- **Create Posts** - Share thoughts in 280 characters or less
- **Edit/Delete Posts** - Manage your own posts
- **Like Posts** - Like and unlike posts from other users
- **Follow/Unfollow** - Follow other users to see their posts in your feed
- **User Profiles** - View user profiles with bio and post history
- **Personal Feed** - See posts from users you follow
- **Responsive Design** - Clean, mobile-friendly interface

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)

### Installation

1. **Clone or download the project**

   ```bash
   cd micro-blog
   ```

2. **Setup Backend**

   ```bash
   cd server
   npm install
   ```

3. **Setup Frontend**

   ```bash
   cd ../client
   npm install
   ```

4. **Configure Environment**
   - Edit `server/.env` file:
   ```
   MONGODB_URI=mongodb://localhost:27017/microblog
   JWT_SECRET=your_secret_key_here
   PORT=5000
   ```

### Running the Application

1. **Start MongoDB** (if running locally)

2. **Start Backend Server**

   ```bash
   cd server
   npm start
   # Server will run on http://localhost:5000
   ```

3. **Start Frontend** (in a new terminal)
   ```bash
   cd client
   npm start
   # App will open at http://localhost:3000
   ```

## 📱 How to Use

1. **Register** - Create a new account with username, email, and password
2. **Login** - Sign in with your credentials
3. **Create Posts** - Share your thoughts (up to 280 characters)
4. **Explore** - View all posts or switch to your personalized feed
5. **Follow Users** - Click on usernames to visit profiles and follow them
6. **Interact** - Like posts and engage with the community

## 🛠 Tech Stack

**Frontend:**

- React 18
- React Router for navigation
- Simple CSS for styling
- Responsive design

**Backend:**

- Node.js & Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS for cross-origin requests

## 📁 Project Structure

```
micro-blog/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── App.js          # Main app component
│   │   └── index.css       # Global styles
│   └── package.json
├── server/                 # Express backend
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Auth middleware
│   ├── server.js           # Server entry point
│   └── package.json
└── README.md
```

## 🔑 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Posts

- `GET /api/posts` - Get all posts
- `GET /api/posts/feed` - Get posts from followed users
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/like` - Like/unlike post

### Users

- `GET /api/users/:username` - Get user profile
- `POST /api/users/:username/follow` - Follow/unfollow user
- `PUT /api/users/profile` - Update user bio

## 🎨 Styling

The app uses simple, clean CSS with:

- Mobile-first responsive design
- Clean color palette (blue and gray tones)
- Card-based layout
- Hover effects and smooth transitions

## 🚧 Future Enhancements

- Image uploads for posts
- Real-time notifications
- Search functionality
- Comments on posts
- Dark mode toggle
- Email verification
- Password reset

## 🤝 Contributing

This is a beginner-friendly project! Feel free to:

- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## 📄 License

This project is open source and available under the MIT License.
