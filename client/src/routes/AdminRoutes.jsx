import React from 'react'
import {Routes, Route} from 'react-router-dom'
import { AdminDash } from '../pages/admin/AdminDash'

export const AdminRoutes = () => {
  return (
     <Routes>
        <Route path='/admin/dashboard' element={<AdminDash/>} />
      </Routes>
  )
}
