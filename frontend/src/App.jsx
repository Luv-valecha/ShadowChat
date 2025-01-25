import { Route, Routes } from 'react-router-dom'
import HomePage from './components/HomePage.jsx'
import LoginPage from './components/LoginPage.jsx'
import ProfilePage from './components/ProfilePage.jsx'
import SettingsPage from './components/SettingsPage.jsx'
import SignUpPage from './components/SignUpPage.jsx'
import Navbar from './components/Navbar.jsx'
import { useAuthStore } from './store/useAuthStore.js'
import { useEffect } from 'react'


function App() {
  const {authUser,checkAuth}= useAuthStore();

  useEffect(()=>{
    checkAuth();
  },[]);

  console.log({authUser});

  return (
    <>
      <Navbar/>

      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/profile' element={<ProfilePage/>} />
        <Route path='/settings' element={<SettingsPage/>} />
        <Route path='/signup' element={<SignUpPage/>} />
      </Routes>
    </>
  )
}

export default App
