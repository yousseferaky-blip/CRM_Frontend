import React from 'react'
import PublicNavbar from '../../Component/Navbar/PublicNavbar'
import Footer from '../../Component/Footer/Footer'
import { Outlet } from 'react-router-dom'

const PublicLayout = () => {
  return (
    <>
        <PublicNavbar />
        <Outlet  />
        <Footer />
    </>
  )
}

export default PublicLayout