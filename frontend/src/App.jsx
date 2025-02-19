import { useState } from 'react'
import './App.css'
import AdminLogin from './components/adminlogin'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AdminHome } from './components/adminhome'
import RegistrationPage from './components/user.registration'
import LoginPage from './components/user.login'
import HomePage from './components/home'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<HomePage/>}/>
      <Route path='/adminlogin' element={<AdminLogin/>}/>
      <Route path='/admin' element={<AdminHome/>}/>
      <Route path='/userregistration' element={<RegistrationPage/>}/>
      <Route path='/userlogin' element={<LoginPage/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
