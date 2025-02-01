import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router";
import { Home } from './pages/user/Home';
import { Login } from './pages/user/Login';
import { Register } from './pages/user/Register';
import { Profile } from './pages/user/Profile';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UserManagement } from './pages/admin/UserManagement';

function App() {

  
  return (
    <>

    {/* This is where we have done the basic routing for the differnt pages */}
      <BrowserRouter>
        <Routes>
          <Route index path='/' element={<Home/>} />
          <Route path='login' element={<Login/>} />
          <Route path='register' element={<Register/>} />
          <Route path='profile' element={<Profile/>} />
          
          <Route path='admin' element={<AdminDashboard/>}>
            <Route path='users' element={<UserManagement/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
