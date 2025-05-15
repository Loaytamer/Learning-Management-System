# Learning Management System (LMS)

A comprehensive mobile-based Learning Management System (LMS) built with Expo Router, React Native, and Node.js with Express and MongoDB.

## Project Overview

This Learning Management System provides a complete solution for educational institutions, instructors, and students to manage and participate in online courses. The application is built with a modern tech stack, featuring a React Native frontend with Expo Router for mobile app development and a Node.js backend with Express and MongoDB for robust data management.

## Features

- **User Authentication**: Secure login and registration system with JWT authentication
- **Course Management**: Create, view, and manage educational courses
- **Lesson Creation**: Add and organize lessons within courses
- **User Profiles**: Personalized user profiles with customization options
- **Notifications**: Real-time notifications for course updates and announcements
- **Responsive UI**: Modern, intuitive interface built with React Native Paper components
- **Cloud Storage**: Media content storage with Cloudinary integration

## Project Structure

The project is organized into two main directories:

### Frontend (Expo Router & React Native)

- **Authentication**: Login and signup screens with secure authentication
- **Tab Navigation**: Home, Courses, Create, Notifications, and Profile tabs
- **Course Management**: Detailed course views and lesson creation
- **Components**: Reusable UI components for consistent design
- **API Integration**: Axios-based services for backend communication

### Backend (Node.js, Express & MongoDB)

- **RESTful API**: Comprehensive API endpoints for all application features
- **MongoDB Models**: Structured data models for users, courses, and lessons
- **Authentication**: JWT-based authentication middleware
- **File Uploads**: Multer and Cloudinary integration for media handling
- **Controllers**: Organized business logic for all application features

## Technology Stack

### Frontend
- React Native 0.79.1
- Expo 53.0.0
- Expo Router 5.0.6
- React Navigation 7
- React Native Paper 5.12.3
- Axios for API requests
- AsyncStorage for local data persistence

### Backend
- Node.js with Express 5.1.0
- MongoDB with Mongoose 8.14.2
- JWT for authentication
- Bcrypt for password hashing
- Cloudinary for media storage
- Multer for file uploads

## Installation and Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Expo CLI

### Frontend Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Loaytamer/Learning-Management-System.git
   ```

2. **Navigate to the frontend directory**:
   ```bash
   cd Learning-Management-System/frontend
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the Expo development server**:
   ```bash
   npx expo start
   ```

### Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd Learning-Management-System/backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create a .env file with the following variables**:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Start the backend server**:
   ```bash
   npm start
   ```


## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
