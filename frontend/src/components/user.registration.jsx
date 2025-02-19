import axios from 'axios';
import React, { useState } from 'react';

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    cpassword: '',
    address: '',
    profile: null,
    usertype: 'customer',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profile: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Validate form fields
    if (!(formData.name && formData.email && formData.password && formData.cpassword && formData.address && formData.profile)) {
      setErrorMessage('Please fill in all fields');
      return;
    }
    if (formData.password !== formData.cpassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    // Call API (this part is simulated)
    setTimeout(async() => {
        const res= await axios.post("http://localhost:3000/api/userregistration",formData);
        const result=await res.data;
        if(res.status==200){
            setSuccessMessage(result.message);
        }
        else{
            setErrorMessage(result.message);
        }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-5">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Create Your Account</h2>
        
        {errorMessage && <div className="bg-red-200 text-red-600 p-3 mb-4 rounded">{errorMessage}</div>}
        {successMessage && <div className="bg-green-200 text-green-600 p-3 mb-4 rounded">{successMessage}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-600">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="example@example.com"
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
              placeholder="********"
            />
          </div>

          <div>
            <label htmlFor="cpassword" className="block text-sm font-medium text-gray-600">Confirm Password</label>
            <input
              type="password"
              id="cpassword"
              name="cpassword"
              value={formData.cpassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="********"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-600">Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your Address"
            />
          </div>

          <div>
            <label htmlFor="profile" className="block text-sm font-medium text-gray-600">Profile Picture</label>
            <input
              type="file"
              id="profile"
              name="profile"
              onChange={handleFileChange}
              className="w-full text-gray-600 file:bg-blue-500 file:text-white file:px-4 file:py-2 file:rounded-md"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="inline-flex items-center text-sm text-gray-600">
              <input
                type="radio"
                name="usertype"
                value="customer"
                checked={formData.usertype === 'customer'}
                onChange={handleChange}
                className="form-radio"
              />
              <span className="ml-2">Customer</span>
            </label>
            <label className="inline-flex items-center text-sm text-gray-600">
              <input
                type="radio"
                name="usertype"
                value="seller"
                checked={formData.usertype === 'seller'}
                onChange={handleChange}
                className="form-radio"
              />
              <span className="ml-2">Seller</span>
            </label>
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none">
            Register
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <a href="/login" className="text-blue-500 hover:underline">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default RegistrationPage;
