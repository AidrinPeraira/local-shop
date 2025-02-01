import React from 'react'
import { Outlet } from 'react-router'

export const AdminDashboard = () => {
  return (
    <div>
      <div>AdminDashboard</div>
      <Outlet/>
    </div>
  )
}
