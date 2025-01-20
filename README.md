# Task Manager Web App (MEAN Stack)

This is a task management web application built with the MEAN stack (MongoDB, Express, Angular, Node.js). It allows users to sign up, log in, create task lists, and manage tasks in a user-friendly interface.

## Features

- **User Authentication**: 
  - Users can sign up and log in to their accounts securely.
  
- **Task Lists**:
  - Users can create multiple task lists.
  - Lists can be updated or deleted as needed.

- **Tasks**:
  - Tasks can be added, edited, and deleted within each list.
  - Tasks can be marked as completed for better organization.
  
- **User Interface**:
  - The application has a clean, simple, and user-friendly UI.

## Technologies Used

- **Frontend**: 
  - Angular
  
- **Backend**:
  - Node.js
  - Express.js
  
- **Database**:
  - MongoDB
  
- **Authentication**:
  - JWT (JSON Web Token)

## Setup Instructions

### Prerequisites

- Node.js and npm (Node Package Manager)
- MongoDB installed locally or an active MongoDB cluster

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/task-manager-app.git
   cd task-manager-app
   ```

2. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:

   ```bash
   cd ../frontend
   npm install
   ```

### Environment Configuration

1. Create a `.env` file in the `backend` directory and add the following configurations:

   ```bash
   MONGO_URI=<your-mongodb-uri>
   JWT_SECRET=<your-jwt-secret>
   ```

2. If you are using MongoDB locally, the `MONGO_URI` can be something like:

   ```bash
   MONGO_URI=mongodb://localhost:27017/task-manager
   ```

### Running the Application

1. Start the backend server:

   ```bash
   cd backend
   npm start
   ```

2. Start the frontend application:

   ```bash
   cd ../frontend
   npm start
   ```

3. Open your browser and go to `http://localhost:4200` to access the Task Manager Web app.

## Usage

1. **Sign Up**: Users can create an account by providing a username and password.
2. **Log In**: After signing up, users can log in to the application.
3. **Create Lists**: Once logged in, users can create new task lists.
4. **Add Tasks**: Within each list, users can add tasks with titles.
5. **Edit/Update Tasks**: Tasks can be edited or deleted at any time.
6. **Mark Tasks as Completed**: Tasks can be marked as completed for better task management.
7. **Update or Delete Lists**: Users can update or delete entire task lists.

## Contributions

Feel free to fork the project and submit issues or pull requests for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.
