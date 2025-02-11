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

-Who will use te platform? (types of logins and dashboards required)
    - Buyers / Users
    - Sellers
    - Dellivery AGents
    - Employees
    - Admins
    - Super Admins


    frontend layout

/localShop (root)
│── 📂 src
│   │── 📂 assets          # Static assets like images, fonts, and global styles
│   │── 📂 components      # Reusable UI components (buttons, modals, etc.)
│   │── 📂 layouts         # Layout components (e.g., Navbar, Sidebar, etc.)
│   │── 📂 pages           # Page components for different routes
│   │── 📂 features        # Redux slices for different features (e.g., auth, products)
│   │── 📂 hooks           # Custom React hooks
│   │── 📂 services        # API calls and Axios interceptors
│   │── 📂 utils           # Utility/helper functions
│   │── 📂 routes          # React Router configuration
│   │── 📂 config          # App-level configuration (e.g., constants, environment variables)
│   │── 📂 middleware      # Middleware like authentication and error handling
│   │── 📜 main.jsx        # Root component (renders App.jsx)
│   │── 📜 App.jsx         # Main App component (sets up routes)
│   │── 📜 store.js        # Redux store configuration
│── 📂 public              # Static public assets (favicon, manifest, etc.)
│── 📜 index.html          # Root HTML file
│── 📜 package.json        # Dependencies and scripts
│── 📜 vite.config.js      # Vite configuration
│── 📜 .env                # Environment variables
│── 📜 .gitignore          # Ignored files for Git
