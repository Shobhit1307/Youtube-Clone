# 🎥 YouTube Clone

A modern, full-stack video sharing platform built with React, Node.js, and MongoDB. Experience YouTube-like functionality with a clean, responsive design and smooth user interactions.

![YouTube Clone](https://img.shields.io/badge/YouTube-Clone-red?style=for-the-badge&logo=youtube)
![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18.0.0-green?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0.0-47A248?style=for-the-badge&logo=mongodb)

## ✨ Features

### 🎬 Video Management
- **Video Upload & Streaming**: Support for MP4 videos with automatic thumbnail generation
- **YouTube Integration**: Embed and play YouTube videos seamlessly
- **Video Player**: Custom video player with controls and fullscreen support
- **Video Categories**: Organize content with filterable categories

### 👤 User Experience
- **User Authentication**: Secure login/register with JWT tokens
- **Profile Management**: Customizable user profiles with avatar support
- **Channel Creation**: Users can create and manage their own channels
- **Responsive Design**: Mobile-first design that works on all devices

### 💬 Social Features
- **Comments System**: Add, edit, and delete comments on videos
- **Like/Dislike**: React to videos with like and dislike functionality
- **Subscriptions**: Subscribe to channels and stay updated
- **User Interactions**: Follow channels and engage with content

### 🎨 Modern UI/UX
- **Dark/Light Theme**: Toggle between themes with system preference detection
- **Smooth Animations**: Subtle hover effects and transitions
- **Search Functionality**: Real-time search with suggestions
- **Responsive Layout**: Adaptive design for all screen sizes

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Redux Toolkit** - State management with Redux Persist
- **React Router** - Client-side routing and navigation
- **Vite** - Fast build tool and development server
- **Tailwind-inspired CSS** - Custom CSS with CSS variables and modern practices

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Tokens for authentication
- **Multer** - File upload middleware

### Additional Tools
- **React Icons** - Beautiful icon library
- **React Toastify** - Toast notifications
- **JWT Decode** - Token parsing utility

## 📁 Project Structure

```
Youtube-Clone/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── features/      # Redux slices and state management
│   │   ├── api/           # API client configuration
│   │   ├── utils/         # Utility functions
│   │   └── app/           # Redux store configuration
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── server/                 # Backend Node.js application
│   ├── controllers/       # Route controllers
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API route definitions
│   ├── middleware/        # Custom middleware
│   ├── uploads/           # File upload directory
│   └── package.json       # Backend dependencies
└── README.md              # Project documentation
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v6.0 or higher)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/youtube-clone.git
cd youtube-clone
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the server directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/youtube-clone
JWT_SECRET=your_jwt_secret_key_here
```

### 3. Frontend Setup
```bash
cd ../client
npm install
```

### 4. Start the Application

**Start Backend (Terminal 1):**
```bash
cd server
npm start
```

**Start Frontend (Terminal 2):**
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 🔧 Configuration

### Environment Variables
- `PORT`: Backend server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation

### Database Setup
1. Install MongoDB locally or use MongoDB Atlas
2. Create a database named `youtube-clone`
3. Update the connection string in your `.env` file

## 📱 Usage

### Getting Started
1. **Register/Login**: Create an account or sign in with existing credentials
2. **Upload Videos**: Share your content with the community
3. **Create Channel**: Build your personal brand
4. **Engage**: Like, comment, and subscribe to channels

### Key Features
- **Video Upload**: Drag and drop or select video files
- **Search**: Find videos and channels quickly
- **Responsive Design**: Works perfectly on mobile and desktop
- **Theme Toggle**: Switch between light and dark modes

## 🎯 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile

### Videos
- `GET /videos` - Get all videos with filters
- `POST /videos` - Upload new video
- `GET /videos/:id` - Get specific video
- `PUT /videos/:id` - Update video
- `DELETE /videos/:id` - Delete video

### Channels
- `POST /channels` - Create channel
- `GET /channels/:id` - Get channel details
- `PUT /channels/:id` - Update channel

### Comments
- `GET /videos/:id/comments` - Get video comments
- `POST /videos/:id/comments` - Add comment
- `PUT /videos/:id/comments/:commentId` - Edit comment
- `DELETE /videos/:id/comments/:commentId` - Delete comment

## 🎨 Customization

### Themes
The application supports both light and dark themes:
- Automatic theme detection based on system preferences
- Manual theme toggle in the header
- Persistent theme selection

### Styling
- Custom CSS with CSS variables for easy theming
- Responsive breakpoints for all devices
- Smooth animations and transitions

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy the dist folder
```

### Backend (Railway/Render)
```bash
cd server
# Set environment variables
# Deploy with your preferred platform
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing framework
- **Node.js Community** - For the robust runtime
- **MongoDB** - For the flexible database
- **Open Source Community** - For inspiration and tools

## 📞 Contact

- **GitHub**: [Shobhit1307](https://github.com/Shobhit1307)
- **LinkedIn**: [Shobhit Jindal](https://www.linkedin.com/in/shobhit-jindal-0b96b5232)
- **Instagram**: [shobhitjindal07](https://www.instagram.com/shobhitjindal07/profilecard/?igsh=MXVwaGE4b2Ftcng2dw==)

---

⭐ **Star this repository if you found it helpful!**

Made with ❤️ by [Your Name]
