# CosmicWatch

CosmicWatch is a web application designed to track and visualize Near-Earth Objects (NEOs). It leverages NASA's NeoWs API to provide real-time data on asteroids approaching Earth, featuring a 3D interactive solar system visualization.

## 🚀 Technologies Used

-   **Frontend:** React, Vite, TailwindCSS, Three.js (@react-three/fiber, @react-three/drei), Redux Toolkit, Socket.io-client, Firebase (Auth)
-   **Backend:** Node.js, Express, MongoDB, Mongoose, Socket.io, Redis (Upstash), Nodemailer
-   **DevOps:** Docker, Docker Compose

## ✨ Key Features

-   **Real-time Asteroid Tracking**: Fetches live data from NASA's NeoWs API to track Near-Earth Objects (NEOs).
-   **3D Solar System Visualization**: Interactive 3D visualization of the solar system and asteroid orbits using Three.js.
-   **Asteroid Explorer**: Search, filter, and view detailed information about specific asteroids, including their size, velocity, and hazardous status.
-   **User Dashboard**: Personalized dashboard to manage watchlist, view recent alerts, and monitor hazardous asteroids.
-   **Real-time Alerts**: severe weather/asteroid approach alerts pushed to connected clients via Socket.io.
-   **Authentication System**: Secure user authentication with JWT, including Signup, Login, OTP Verification, and Password Reset.
-   **Watchlist**: Users can save interesting asteroids to their personal watchlist for easy access.
-   **Responsive Design**: Fully responsive UI built with TailwindCSS for seamless experience across devices.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
-   [Node.js](https://nodejs.org/) (v16 or higher)
-   [MongoDB](https://www.mongodb.com/try/download/community) (Local or Atlas)
-   [Docker](https://www.docker.com/products/docker-desktop) (Optional, for containerized run)

## 🔑 API Keys & Configuration

You will need to obtain API keys from the following services:

1.  **NASA API:** [Get Key](https://api.nasa.gov/)
2.  **Firebase:** Create a project in [Firebase Console](https://console.firebase.google.com/) for Authentication.
3.  **Upstash Redis:** Create a database in [Upstash](https://upstash.com/) for Redis caching.
4.  **MongoDB:** Use a local URI (`mongodb://localhost:27017/cosmicwatch`) or a specific Atlas URI.

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/VijaySaiBorru/CosmicWatch.git
cd CosmicWatch
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory based on the example:
```bash
cp .env.example .env
```
Update the `.env` file with your **NASA API Key**, **MongoDB URI**, **Redis credentials**, and **Email settings**.

### 3. Frontend Setup
Navigate to the frontend directory and install dependencies:
```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` directory based on the example:
```bash
cp .env.example .env
```
Update the `.env` file with your **Firebase configuration** and set `VITE_BASE_URL` to your backend URL (default: `http://localhost:5000`).

## 🏃 running the Application

### Development Mode

1.  **Start the Backend:**
    ```bash
    # In backend directory
    npm run dev
    ```

2.  **Start the Frontend:**
    ```bash
    # In frontend directory
    npm run dev
    ```
    Access the frontend at `http://localhost:5173`.

### Using Docker Compose

You can run the entire stack (Frontend, Backend, MongoDB, Redis) using Docker Compose.

1.  Ensure Docker Desktop is running.
2.  Run the following command in the root directory:
    ```bash
    docker-compose up --build
    ```
    - Frontend: `http://localhost:80`
    - Backend: `http://localhost:5000`

## 📂 Project Structure

```
CosmicWatch/
├── backend/            # Express server & API
│   ├── src/
│   │   ├── config/     # DB, Redis, Socket config
│   │   ├── controllers/# Route controllers
│   │   ├── models/     # Mongoose models
│   │   └── routes/     # API routes
│   └── ...
├── frontend/           # React application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Route pages
│   │   ├── redux/      # State management
│   │   └── ...
│   └── ...
└── docker-compose.yml  # Docker orchestration
```
