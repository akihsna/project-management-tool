# Project Management Tool

A full-stack project management web application for managing projects, tasks, team members, and workspace activity from one dashboard.

## Overview

This project helps users organize project work in a simple workspace. Users can sign up, log in, create projects, add and update tasks, manage team members, and view project statistics from a dashboard.

## Features

- User signup and login
- Password hashing using bcrypt
- Project creation, status updates, and deletion
- Task creation, editing, deletion, and status tracking
- Task priority management
- Team member management
- Workspace configuration
- Dashboard with project, task, team, and completed task counts
- Dark mode support
- Responsive React interface
- REST API backend connected to MongoDB

## Tech Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- Axios
- React Router DOM

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- bcryptjs
- CORS
- dotenv

## Project Structure

```text
project-management-tool/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── server/              # Node.js and Express backend
│   ├── models/
│   ├── server.js
│   └── package.json
└── README.md
```

## Prerequisites

Before running this project, make sure you have installed:

- Node.js
- npm
- MongoDB Atlas account or local MongoDB setup
- Git

## Installation And Setup

### 1. Clone the repository

```bash
git clone https://github.com/akihsna/project-management-tool.git
cd project-management-tool
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

Open a new terminal from the project root:

```bash
cd server
npm install
```

### 4. Create backend environment file

Inside the `server` folder, create a `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
PORT=8000
```

Replace `your_mongodb_connection_string` with your MongoDB connection URL.

Example:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/project-management-tool
PORT=8000
```

## Running The Project

You need to run the backend and frontend in two separate terminals.

### Start the backend server

```bash
cd server
npm run dev
```

The backend will run on:

```text
http://localhost:8000
```

### Start the frontend

```bash
cd client
npm run dev
```

The frontend will usually run on:

```text
http://localhost:5173
```

Open the frontend URL in your browser.

## Important Note

Do not run `npm run dev` from the main project folder because there is no root `package.json`.

Run frontend commands inside the `client` folder and backend commands inside the `server` folder.

## Available Scripts

### Frontend

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

### Backend

```bash
npm start
npm run dev
```

## API Endpoints

### Authentication

- `POST /signup` - Register a new user
- `POST /login` - Log in an existing user

### Projects

- `GET /projects` - Get all projects
- `POST /projects` - Create a new project
- `PUT /projects/:id` - Update a project
- `DELETE /projects/:id` - Delete a project

### Tasks

- `GET /tasks` - Get all tasks
- `POST /tasks` - Create a new task
- `PUT /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task

### Team

- `GET /team` - Get all team members
- `POST /team` - Add a team member
- `DELETE /team/:id` - Delete a team member

### Workspace

- `GET /workspace` - Get workspace details
- `POST /workspace` - Create workspace details
- `PUT /workspace/:id` - Update workspace details

## How To Use

1. Start the backend server.
2. Start the frontend application.
3. Open the frontend URL in your browser.
4. Sign up with your name, email, and password.
5. Log in using your credentials.
6. Create projects from the Projects page.
7. Add and manage tasks from the Tasks page.
8. Add team members from the Team page.
9. View overall progress from the Dashboard.

## Screenshots

Add screenshots of your application here after uploading them to the repository.

Example:

```md
![Dashboard Screenshot](screenshots/dashboard.png)
```

## Future Improvements

- Add JWT authentication
- Add user-specific projects and tasks
- Add drag-and-drop task board
- Add search and filters
- Add task due dates
- Add deployment configuration

## Author

Anshika Singh

GitHub: [akihsna](https://github.com/akihsna)
