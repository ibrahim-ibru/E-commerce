import { useState } from 'react'
import './App.css'
import AdminLogin from './components/adminlogin'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AdminHome } from './components/adminhome'
import RegistrationPage from './components/user.registration'
import LoginPage from './components/user.login'
import PumaStore from './components/home'
import ForgotPassword from './components/forgetpassword'
import ChangePassword from './components/user.changepassword'
import { EmailProvider } from './context/email.context'

function App() {

  return (
    <>
    <BrowserRouter>
      <EmailProvider>
    <Routes>
        <Route path='/' element={<PumaStore/>}/>
      <Route path='/adminlogin' element={<AdminLogin/>}/>
      <Route path='/admin' element={<AdminHome/>}/>
      <Route path='/userregistration' element={<RegistrationPage/>}/>
      <Route path='/userlogin' element={<LoginPage/>}/>
      <Route path='/forgetpassword' element={<ForgotPassword/>}/>
      <Route path='/setpassword' element={<ChangePassword/>}/>
      
    </Routes>
      </EmailProvider>
    </BrowserRouter>
    </>
  )
}

export default App
