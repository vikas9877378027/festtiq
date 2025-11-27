# Festiq - Venue Booking Platform

A full-stack MERN (MongoDB, Express, React, Node.js) application for discovering, comparing, and booking event venues.

## Project Structure

```
Festiq-17nov/
├── client/          # Frontend React application
│   ├── src/         # React source files
│   ├── public/      # Public assets
│   └── package.json # Frontend dependencies
├── server/          # Backend Node.js/Express server
│   ├── controllers/ # Route controllers
│   ├── models/      # Database models
│   ├── routes/      # API routes
│   ├── middlewares/ # Custom middlewares
│   └── server.js    # Server entry point
└── README.md        # This file
```

## Features

- 🔐 User authentication with Auth0 (Google, Facebook, Apple)
- 🏢 Venue browsing and booking system
- 🎨 Service management
- 📸 Gallery management
- 👤 User profile and bookings management
- 🔧 Admin dashboard for managing venues, services, gallery, and users
- 💾 MongoDB database
- ☁️ Cloudinary integration for image storage

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vikas9877378027/festtiq.git
   cd Festiq-17nov
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../server
   npm install
   ```

4. **Configure Environment Variables**

   Create `.env` files in both `client/` and `server/` directories with your configuration:
   
   **server/.env**
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   PORT=4000
   ```
   
   **client/.env**
   ```env
   VITE_API_BASE_URL=http://localhost:4000/api
   ```

5. **Run the Application**

   **Start Backend Server:**
   ```bash
   cd server
   npm start
   ```

   **Start Frontend Development Server:**
   ```bash
   cd client
   npm run dev
   ```

   The application will be available at:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- Axios
- Auth0 React SDK
- React Toastify

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Cloudinary for image storage
- Multer for file uploads

## Deployment

The project includes PM2 configuration for production deployment. See `ecosystem.config.js` for details.

## License

This project is private and proprietary.
