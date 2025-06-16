import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import Navbar from './components/Navbar.jsx'
import { useAuthStore } from './store/useAuthStore.js'
import { useEffect } from 'react'

import {Loader} from "lucide-react"
import {Toaster} from "react-hot-toast"
import { useThemeStore } from './store/useThemeStore.js'
import AdminPage from './pages/AdminPage.jsx'
import CodeRoom from './components/CodeRoom.jsx'

function App() {
  const {authUser,checkAuth,isCheckingAuth}= useAuthStore();
  const {theme} = useThemeStore();

  useEffect(()=>{
    checkAuth();
  },[]);

  // console.log({authUser});

  // diaplaying Loader while authenticating the user
  if(isCheckingAuth && authUser){
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader className = "size-10 animate-spin"/>
      </div>
    )
  }
  return (
    <div data-theme= {theme}>
      <Navbar/>

      <Routes>
        <Route path='/' element={authUser ? (authUser.role==="user" ? <HomePage/> : <AdminPage/>) : <Navigate to="/login" />} />
        <Route path='/login' element={ !authUser ? <LoginPage/>  : < Navigate to="/" />} />
        <Route path='/profile' element={authUser ? <ProfilePage/> : <Navigate to="/login" />} />
        <Route path='/settings' element={<SettingsPage/>} />
        <Route path='/signup' element={!authUser ? <SignUpPage/> : < Navigate to="/" />} />
        <Route path='/editor/:roomId' element={authUser ? <CodeRoom/> : <Navigate to="/login" />} />
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App
