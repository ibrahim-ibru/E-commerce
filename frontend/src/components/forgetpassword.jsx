import React, { useState } from 'react';
import axios from 'axios';

export default function ForgotPassword() {
  const [message, setMessage] = useState('');
  const [email, setEmailInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (email) {
      try {
        setIsLoading(true);
        const res = await axios.post('http://localhost:3000/api/forgetpassword', { email });
        console.log(res.data);

        if (res.status === 200) {
          const { message } = res.data; 
          localStorage.setItem("email", email);
          setMessage(`A reset link has been sent to ${email}`);
        } else {
          setMessage('Something went wrong. Please try again.');
        }
      } catch (error) {
        console.error(error);
        setMessage('There was an error sending the reset link. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    } else {
      setMessage('Please enter a valid email address.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
                onChange={(e) => setEmailInput(e.target.value)}
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
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
              disabled={isLoading} // Disable button during loading state
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white mr-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path
                    fill="currentColor"
                    d="M4 12a8 8 0 0 1 8-8 8 8 0 0 1 8 8h-2a6 6 0 1 0-12 0h-2z"
                  />
                </svg>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
