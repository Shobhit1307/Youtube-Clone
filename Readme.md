Video Subscription Backend API
Overview
This project is a backend RESTful API for a video subscription platform similar to YouTube. It manages users, channels, videos, and subscriptions with features such as:

User authentication and authorization

Video uploading, editing, deleting

Channel subscription toggling

Fetching subscribed channels with latest videos

Video liking and disliking

Trending and recommended videos based on category

Video view counting

The backend is built with Node.js, Express, and MongoDB (Mongoose). It serves JSON data consumed by a frontend client.

Features
User Management: Users can create accounts, log in, and manage subscriptions.

Channels: Users can create channels, upload videos to channels.

Subscriptions: Users can subscribe/unsubscribe to channels.

Video Management: Upload videos (files or external URLs), update details, delete videos.

Recommendations: Get videos recommended by category or random fallback.

Video Interactions: Like or dislike videos.

View Tracking: Video views incremented on access.

Secure Endpoints: Middleware ensures user authentication for protected routes.

Tech Stack
Node.js with Express.js

MongoDB with Mongoose ODM

JWT for authentication

Multer for file uploads

Environment variables for config

Installation
Prerequisites
Node.js (v14+ recommended)

MongoDB instance (local or remote)

npm or yarn

Steps
Clone the repository

bash
Copy
Edit
git clone https://github.com/yourusername/your-repo.git
cd your-repo
Install dependencies

bash
Copy
Edit
npm install
# or
yarn install
Configure environment variables

Create a .env file in the root directory with at least:

env
Copy
Edit
PORT=5000
MONGODB_URI=mongodb://localhost:27017/yourdbname
JWT_SECRET=your_jwt_secret_here
SERVER_URL=http://localhost:5000
Adjust values as per your environment.

Run the server

bash
Copy
Edit
npm run dev
# or
node server.js
Server will start on the specified port (default 5000).

API Endpoints Overview
Authentication
POST /api/auth/register — Register a new user

POST /api/auth/login — Login and receive JWT token

Channels
GET /api/channels/:id — Get channel info and videos

POST /api/channels — Create a new channel (auth required)

Subscriptions
POST /api/subscriptions/:channelId — Toggle subscription (subscribe/unsubscribe) (auth required)

GET /api/subscriptions — Get channels subscribed by logged-in user with latest videos (auth required)

Videos
GET /api/videos — List all videos (with optional search and category filters)

GET /api/videos/:id — Get details of a single video (increments views)

POST /api/videos — Upload new video (auth required)

PUT /api/videos/:id — Update video details (auth required & must be uploader)

DELETE /api/videos/:id — Delete video (auth required & must be uploader)

POST /api/videos/:id/like — Like/unlike a video (auth required)

POST /api/videos/:id/dislike — Dislike/undislike a video (auth required)

GET /api/videos/trending — Get top trending videos

GET /api/videos/:id/recommended — Get recommended videos by category or fallback random

How to Use
Register and login to get a JWT token.

Authenticate requests by adding Authorization: Bearer <token> header to protected endpoints.

Create channels or manage existing ones.

Upload videos to channels with file uploads or external URLs.

Subscribe to channels and get personalized subscription feeds.

Interact with videos by liking, disliking, and watching trending or recommended videos.

Folder Structure
bash
Copy
Edit
/backend
  /controllers
    channelController.js
    subscriptionController.js
    videoController.js
    userController.js
  /models
    Channel.js
    User.js
    Video.js
  /routes
    authRoutes.js
    channelRoutes.js
    subscriptionRoutes.js
    videoRoutes.js
  /middleware
    authMiddleware.js
  server.js
.env
package.json
README.md
Notes
Ensure MongoDB is running and accessible via the URI you provide.

Use tools like Postman or Insomnia for manual API testing.

File uploads require proper multipart/form-data requests.

The API responses are JSON; the frontend consumes these to display data.

Error handling returns appropriate HTTP status codes and messages.

Future Improvements
Add pagination support on video and subscription listings.

Implement search suggestions and advanced filtering.

Add user profile management endpoints.

Improve security with rate limiting and validation.

Add automated tests for controllers and routes.

#The video for working project is uploaded on the channel only you can watch their only 

For contact 
Github Profile--
https://github.com/Shobhit1307/Youtube-Clone
