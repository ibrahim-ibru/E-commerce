import { useState } from 'react'
import './App.css'
import AdminLogin from './components/adminlogin'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AdminHome } from './components/adminhome'
import RegistrationPage from './components/user.registration'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/adminlogin' element={<AdminLogin/>}/>
      <Route path='/admin' element={<AdminHome/>}/>
      <Route path='/userregistration' element={<RegistrationPage/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
