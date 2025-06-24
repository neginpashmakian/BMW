# BMW IT Internship - Backend and Frontend

This repository contains the backend and frontend of the BMW Battery Development IT Internship project. The project demonstrates a full-stack application using modern web technologies, including React, Node.js, and MongoDB, with a focus on battery development.

## Table of Contents

- [Project Overview](#project-overview)
- [Technologies](#technologies)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Docker Setup](#docker-setup)
- [API Endpoints](#api-endpoints)

## Project Overview

This project simulates an electric vehicle battery development platform for BMW. It consists of:

- A **frontend** built with **React.js** and **Material UI** to create a dynamic user interface.
- A **backend** built with **Node.js**, **Express**, and **MongoDB** to handle database interactions and API requests.

The backend connects to a MongoDB Atlas database to store and manage data, and the frontend allows users to interact with it in an intuitive way.

## Technologies

- **Frontend:**
  - React.js
  - Material UI
  - Axios for API calls
  - React Router for routing
- **Backend:**
  - Node.js
  - Express.js
  - MongoDB (using Mongoose ORM)
  - CORS for cross-origin requests
- **Other:**
  - Docker (for containerization)
  - dotenv for environment variables

## Backend Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/neginpashmakian/BMW.git
   cd BMW/backend
   Install dependencies:
   ```

bash
Copy
npm install
Create a .env file:
In the backend folder, create a .env file and add your MongoDB URI and port:

env
Copy
PORT=5050
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.snmr7a5.mongodb.net/bmw-db?retryWrites=true&w=majority
Run the backend:

bash
Copy
node server.js
The backend server should now be running on http://localhost:5050.

Frontend Setup
Navigate to the frontend folder:

bash
Copy
cd ../frontend
Install dependencies:

bash
Copy
npm install
Run the frontend:

bash
Copy
npm start
The frontend should now be running on http://localhost:3000.

Docker Setup
Build and run the containers with Docker Compose:
In the project root directory (where docker-compose.yml is located), run the following command:

bash
Copy
docker-compose up --build
This will build the Docker images and start the frontend and backend services.

Access the application:

Frontend: http://localhost:3000

Backend: http://localhost:5050

API Endpoints
The backend exposes the following endpoints:

GET / - A simple test route to check if the server is running.

POST /data/filter - Accepts filtering options to retrieve filtered data from the MongoDB database.

Example Request to Filter Data:

json
Copy
{
"field": "Brand",
"operator": "contains",
"value": "BMW"
}
