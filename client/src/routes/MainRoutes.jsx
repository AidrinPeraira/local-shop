import React from 'react'
import {Routes, Route} from 'react-router-dom'
import { Home } from '../pages/Home'
import { Login } from '../pages/Login'
import { Register } from '../pages/Register'
import { Shop } from '../pages/Shop'
import { NotFound } from '../pages/NotFound'

export const MainRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/register' element={<Register/>} />
      <Route path='/shop' element={<Shop/>} />
      <Route path="*" element={<NotFound/>} />
    </Routes>
  )
}
