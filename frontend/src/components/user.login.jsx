import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const navigate=useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!(formData.email && formData.password)) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    try {
      const res = await axios.post('http://localhost:3000/api/userlogin', formData);
      if (res.status === 200) {
        setSuccessMessage('Login successful!');
        // navigate("")
      }
    } catch (error) {
      setErrorMessage('Invalid credentials or something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-5">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">Login to Your Account</h2>

        {errorMessage && <div className="bg-red-200 text-red-600 p-3 mb-4 rounded">{errorMessage}</div>}
        {successMessage && <div className="bg-green-200 text-green-600 p-3 mb-4 rounded">{successMessage}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none">
            Login
          </button>
        </form>

        <div className="flex items-center justify-between mt-4">
          <a href="/forgot-password" className="text-sm text-blue-500 hover:underline">Forgot password?</a>
          <a onClick={()=>{navigate("/userregistration")}} className="text-sm text-blue-500 hover:underline">Create an account</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
