import React, { useEffect } from 'react'
import SignIn from './pages/sign-in/SignIn'
import SignUp from './pages/sign-up/SignUp'
import AdminDashboard from './pages/admin-dashboard/admin-dahboard'
import Home from './pages/home/home'
import { Navigate, Outlet } from 'react-router'


const App = () => {

  return (
    <>
      {/* <Navigate to='/sign-in' replace/> */}
      <Outlet/>
    </>
  )
}

export default App