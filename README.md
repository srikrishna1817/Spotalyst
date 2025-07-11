# 🌍 Spotalyst

A comprehensive web application for discovering, managing, and planning visits to amazing places around the world. Built with React, Node.js, Express, and MongoDB.

## ✨ Features

### 🔍 Smart Location Search
- **Intelligent Autocomplete**: Real-time location suggestions using LocationIQ API
- **Place & City Search**: Separate search for places and cities with auto-suggestions
- **Global Coverage**: Search for locations worldwide

### ⏰ Advanced Time Planning
- **Duration Planning**: Set recommended visit duration in hours
- **Start Time Scheduling**: Plan your visit start time
- **Operating Hours**: Track opening and closing times
- **Smart Conflict Detection**: Automatic warnings for timing conflicts
- **Visual Time Validation**: Color-coded feedback for timing feasibility

### 🎯 Audience Targeting
- **Multiple Audience Types**: Family, Friends, Couples, Solo Travelers, etc.
- **Personalized Recommendations**: Tailored suggestions based on audience
- **Flexible Categories**: Heritage, Religious, Adventure, Nature, Cultural, Food, Shopping, Entertainment

### 📱 Modern User Interface
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Beautiful Gradients**: Eye-catching color schemes and animations
- **Interactive Elements**: Hover effects, smooth transitions, and micro-interactions
- **Bootstrap Integration**: Professional styling with custom enhancements

### 📊 Data Management
- **CRUD Operations**: Create, Read, Update, Delete spots
- **Real-time Updates**: Instant reflection of changes
- **Data Persistence**: MongoDB integration for reliable storage
- **Email Tracking**: Associate spots with user email addresses

## 🛠️ Tech Stack

### Frontend
- **React 18.2.0** - Modern UI library
- **Bootstrap 5.3.1** - Responsive CSS framework
- **Axios 1.5.0** - HTTP client for API calls
- **LocationIQ API** - Location search and autocomplete

### Backend
- **Node.js** - JavaScript runtime
- **Express 4.18.2** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose 7.5.0** - MongoDB object modeling
- **CORS 2.8.5** - Cross-origin resource sharing
- **dotenv 16.3.1** - Environment variable management

### Development Tools
- **Nodemon 3.0.1** - Development server auto-restart
- **Concurrently 8.2.0** - Run multiple commands simultaneously
- **React Scripts 5.0.1** - Create React App build tools

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v14.0.0 or higher)
- **npm** (v6.0.0 or higher)
- **MongoDB** account and cluster
- **LocationIQ** API key (free tier available)



The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📁 Project Structure

```
spot-explorer/
├── client/                 # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   ├── App.css        # Component styles
│   │   ├── index.js       # React entry point
│   │   └── index.css      # Global styles
│   └── package.json       # Client dependencies
├── controllers/           # Express route controllers
│   └── spotController.js  # Spot CRUD operations
├── models/               # MongoDB schemas
│   └── Spot.js          # Spot data model
├── routes/              # Express routes
│   └── spotRoutes.js    # Spot API routes
├── .env                 # Environment variables
├── .gitignore          # Git ignore rules
├── package.json        # Server dependencies
├── server.js           # Express server setup
└── README.md           # Project documentation
```

## 🔌 API Endpoints

### Spots
- `GET /api/spots` - Get all spots
- `POST /api/spots` - Create a new spot
- `PUT /api/spots/:id` - Update a spot
- `DELETE /api/spots/:id` - Delete a spot
- `POST /api/spots/bulk` - Bulk insert spots



## 👨‍💻 Author

**Your Name**
- GitHub: [@srikrishna1817](https://github.com/srikrishna)
- LinkedIn: [Srikrishna Kasivajhula](https://www.linkedin.com/in/srikrishna-kasivajhula-4897732a7/)
- Email: srikrishna1817@gmail.com

## 🙏 Acknowledgments

- [LocationIQ](https://locationiq.com/) for location search API
- [Bootstrap](https://getbootstrap.com/) for UI components
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for database hosting
- [React](https://reactjs.org/) for the amazing frontend framework


---

⭐ **Star this repository if you found it helpful!**
