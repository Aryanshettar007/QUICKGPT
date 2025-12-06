import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import { Route, Routes, useLocation } from 'react-router-dom'
import ChatBox from './components/ChatBox'
import Credits from './pages/Credits'
import Community from './pages/Community'
import Login from './pages/Login'
import { assets } from './assets/assets'
import './assets/prism.css'
import Loading from './pages/Loading'
import { Toaster } from 'react-hot-toast'
import { useAppContext } from './context/AppContext'

const App = () => {
  const { user, loadingUser } = useAppContext()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { pathname } = useLocation()

  if (pathname === '/loading' || loadingUser) return <Loading />

  return (
    <>
      <Toaster position="top-center" />
      {!isMenuOpen && (
        <img
          onClick={() => setIsMenuOpen(true)}
          src={assets.menu_icon}
          alt="menu"
          className="absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden invert dark:invert-0 z-10"
        />
      )}

      {user ? (
        <div className="bg-white dark:bg-gradient-to-b dark:from-[#1a102b] dark:via-[#29184B] dark:to-[#531B81] dark:text-white transition-all duration-500 min-h-screen h-screen max-md:h-[100dvh]">
          <div className="flex h-full w-screen">
            <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            <Routes>
              <Route path="/" element={<ChatBox />} />
              <Route path="/credits" element={<Credits />} />
              <Route path="/community" element={<Community />} />
            </Routes>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-b from-[#242124] to-[#000000] flex items-center justify-center h-screen w-screen max-md:h-[100dvh]">
          <Login />
        </div>
      )}
    </>
  )
}

export default App
