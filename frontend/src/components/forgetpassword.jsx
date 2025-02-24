import React, { useState } from 'react';
import axios from 'axios';
import { useEmailContext } from '../context/email.context';


export default function ForgotPassword() {
  const {setEmail}=useEmailContext()
  const [message, setMessage] = useState('');
  const [email, setEmailinput] = useState('');
  
  const handleSubmit = async(e) => {
    e.preventDefault();

    setEmail(email)
    
    if (email) {
      try {
        
        const res=await axios.post('http://localhost:3000/api/forgetpassword', {email});
        console.log(email);
        console.log(res.data);
        if (res.status == 200) {
          const {message}=await res.data;
          
          setMessage(`A reset link has been sent to ${email}`);
        } else {
        }
      } catch (error) {
        console.log(error);
        
      }
    } else {
      
      setMessage('Please enter a valid email address.');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Forgot Password
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmailinput(e.target.value)}
                />
            </div>
          </div>

          {message && (
            <div
            className={`${
              message.includes('sent') ? 'text-green-500' : 'text-red-500'
            } text-center mt-4`}
            >
              {message}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
              Send Reset Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



