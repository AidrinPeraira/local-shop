import React from 'react'
import {Routes, Route} from 'react-router-dom'
import { Home } from '../pages/Home'
import { Login } from '../pages/Login'
import { Register } from '../pages/Register'
import { Shop } from '../pages/Shop'
import { NotFound } from '../pages/NotFound'
import { SavedList } from '../pages/SavedList'
import { Cart } from '../pages/Cart'
import { Product } from '../pages/Product'

const MainRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/register' element={<Register/>} />
      <Route path='/shop' element={<Shop/>} />
      <Route path='/saved' element={<SavedList/>} />
      <Route path='/cart' element={<Cart/>} />
      <Route path='/product' element={<Product/>} />
      <Route path="*" element={<NotFound/>} />
    </Routes>
  )
}

export default MainRoutes