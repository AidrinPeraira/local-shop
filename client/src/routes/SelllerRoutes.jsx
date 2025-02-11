import React from 'react'
import { Routes, Route, Router } from 'react-router-dom'
import { SellerDash } from '../pages/seller/SellerDash'

export const SelllerRoutes = () => {
  return (
    <Routes>
      <Route path='/seller/dashboard' element={<SellerDash/>}/>
    </Routes>
  )
}
