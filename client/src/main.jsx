import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {ThemeProvider} from '@mui/material'
import { customTheme } from './customThemeMUI.js'

import { createBrowserRouter, RouterProvider } from 'react-router'
import SignIn from './pages/sign-in/SignIn.jsx'
import SignUp from './pages/sign-up/SignUp.jsx'
import AdminDashboard from './pages/admin-dashboard/admin-dahboard.jsx'
import Home from './pages/home/home.jsx'

const router = createBrowserRouter([

  {path: '/', element: <App/>, children:[
    {path: 'sign-up', element: <SignUp/> },
    {path: 'sign-in', element: <SignIn/> },
    {path: 'admin-dash', element: <AdminDashboard/> },
    {path: 'home', element: <Home/> }
  ]}

])



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router ={router} />
  </StrictMode>
)
