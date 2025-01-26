- Hi there this is where i am going to leave any notes for the project
- Hope this turns out great!!

- Lets follow the following file structure as refernce
my-mern-app/
├── client/                    # React frontend
│   ├── public/                # Static assets (index.html, favicon, etc.)
│   ├── src/                   # React source code
│   │   ├── assets/            # Image files and other assets
│   │   ├── components/        # Reusable React components
│   │   ├── context/           # Context API for global state management (optional)
│   │   ├── hooks/             # Custom React hooks (optional)
│   │   ├── pages/             # React component for each page of the application
│   │   ├── services/          # API service files to interact with backend
│   │   ├── App.js             # Main application entry point
│   │   ├── index.js           # ReactDOM.render and root React component
│   │   └── style.css          # Global styles (or styled-components if preferred)
│   ├── .env                   # Environment variables for the frontend (optional)
│   └── package.json           # Frontend-specific dependencies and scripts
├── server/                    # Node/Express backend
│   ├── config/                # Database, middleware configurations, etc.
│   │   ├── db.js              # MongoDB connection setup
│   │   └── keys.js            # API keys or credentials
│   ├── controllers/           # Express controllers that handle business logic
│   │   └── userController.js
│   ├── models/                # MongoDB models (schemas)
│   │   └── User.js            # User model example
│   ├── routes/                # Express routes
│   │   └── userRoutes.js      # Routes for handling user actions (signup, login)
│   ├── middleware/            # Custom middleware (authentication, logging, etc.)
│   │   └── authMiddleware.js  # Example of auth check middleware
│   ├── server.js              # Main backend entry point
│   ├── .env                   # Environment variables for the backend (optional)
│   └── package.json           # Backend-specific dependencies and scripts
├── .gitignore                 # Git ignore file (to exclude node_modules, .env, etc.)
└── README.md                  # Project overview and instructions
