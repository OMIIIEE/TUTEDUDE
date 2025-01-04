# Friend Finder Application

## Assignment Overview

Develop a full-stack web application using the MERN stack (MongoDB, Express.js, React.js, Node.js) that enables users to search and add friends. The application features a simple and intuitive frontend UI, an optimized backend for performance, and includes a friend recommendation system.

## Features

- **User Authentication**: Register and login functionality.
- **Friend Management**: Send, accept, and reject friend requests.
- **Friend Recommendations**: Get friend recommendations based on mutual friends.
- **Search Users**: Search for users by name or username.
- **Friends List**: View a list of all friends.
- **Pending Requests**: View and manage pending friend requests.

## Technologies Used

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **State Management**: Redux

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/sohamjain125/tutedude.git
   cd tutedude
   ```

2. **Install dependencies**:

   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the `backend` directory and add the following:

   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. **Run the application**:

   ```bash
   # Run backend server
   cd backend
   npm start

   # Run frontend server
   cd ../frontend
   npm start
   ```

## Usage

1. **Register**: Create a new account.
2. **Login**: Access your account.
3. **Dashboard**: View your profile and friend recommendations.
4. **Search**: Find users by name or username.
5. **Friend Requests**: Send, accept, or reject friend requests.
6. **Friends List**: View your friends.

## Folder Structure

```
friend-finder/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── server.js
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── App.jsx
│   │   └── index.js
│   └── public/
└── README.md
```

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.

## Contact

For any questions or feedback, please contact sohamjain125@gmail.com .

## Dashboard

![alt text](image.png)

## Friend List , Pending req and Recommendations

![alt text](image-1.png)
