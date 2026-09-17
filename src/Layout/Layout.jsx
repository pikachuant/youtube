import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'

function Layout() {
const[sidebarOpen,setopenSidebar]=useState(true)
  return (
    <>
    <Navbar
    sidebarOpen={sidebarOpen}
    setopenSidebar={setopenSidebar}
    />

    <Sidebar
    sidebarOpen={sidebarOpen}
    />

    <main>
        <Outlet />
    </main>
    
    </>
  )
}

export default Layout