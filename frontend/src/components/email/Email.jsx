import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import route from '../route';

const Email = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  
  const handleChange = (event) => {
    setEmail(event.target.value);
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const { status, data } = await axios.post(
      `${route()}verifyemail`,
      { email },
      { Headers: { "Content-Type": "application/json" } }
    );
    
    if (status === 200) {
      localStorage.setItem('email', email);
      alert(data.msg);
      navigate('/');
    } else if (status === 403) {
      alert(data.msg);
    } else {
      alert(data.msg);
    }
  };
  
  return (
    <div className="font-sans bg-gradient-to-r from-white via-yellow-100 to-white min-h-screen">
      <div className="max-w-md mx-auto mt-32 p-5 bg-sky-400 rounded-2xl shadow-lg backdrop-blur-sm border border-white/30">
        <h1 className="text-center text-white font-bold text-xl mb-4">Email Verification</h1>
        <form id="forms" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1 font-bold text-white">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="w-full p-2 mb-4 bg-white/90 rounded outline-none"
            />
          </div>
          <button 
            type="submit"
            className="w-full p-2.5 bg-slate-500 text-white border-none rounded font-medium cursor-pointer transition-colors hover:bg-slate-400"
          >
            VERIFY
          </button>
          <div className="mt-4 ml-48 text-sm text-gray-100">
            <p className="back-to-login">
              <Link to={'/login'} className="font-semibold hover:underline">
                Back to Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Email;