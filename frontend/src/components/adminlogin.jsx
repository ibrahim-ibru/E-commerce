import React, { useState } from 'react';
import "../css/admin.css"
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from "axios"
function AdminLogin() {

    // const navigate=useNavigate()    
    const [showpassword,setShowpassword]=useState(false)
    const [data,setData]=useState({
        email:"",
        password:""
    })

    const handleChange=(e)=>{
        setData({...data,[e.target.name]:e.target.value})
    }

    const handleSubmit=(e)=>{
        e.preventDefault()
        console.log(data);
        const res=async()=>{
            const response=await axios.post("http://localhost:3000/api/adminlogin",data);
            const result=await response.data;
            
            if(response.status==200){
                toast.success(result.message, {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    });
                // localStorage.setItem("token",result.token)
            }
            else{
                alert(result.message);
            }
    }
    res()
    }



    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                    <ToastContainer />
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
                    Admin Login
                </h2>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter your email"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter your password"
                            onChange={handleChange}
                        />
                    </div>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                    >
                        Login
                    </button>
                <div className="mt-4 text-center">
                    <a href="#" className="text-sm text-indigo-600 hover:underline">Forgot password?</a>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;    