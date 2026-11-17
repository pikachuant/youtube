import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'

function Layout() {
  // Default: minimized. Remembers user's choice across refreshes via localStorage.
  const [sidebarOpen, setopenSidebar] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen')
    return saved !== null ? JSON.parse(saved) : false
  })

  const toggleSidebar = () => {
    const next = !sidebarOpen
    setopenSidebar(next)
    localStorage.setItem('sidebarOpen', JSON.stringify(next))
  }

  return (
    <>
      <Navbar
        sidebarOpen={sidebarOpen}
        setopenSidebar={toggleSidebar}
      />

      <Sidebar sidebarOpen={sidebarOpen} />

      <main className={`layout-main ${sidebarOpen ? 'layout-main--open' : 'layout-main--mini'}`}>
        <Outlet />
      </main>
    </>
  )
}

export default Layout