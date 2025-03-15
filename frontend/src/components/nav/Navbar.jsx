import React, { useEffect, useState } from 'react';
import { FaUserCircle, FaShoppingCart, FaSearch, FaChevronDown, FaStore } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ username, role, loggedIn, setLoggedIn }) => {
  const navigate = useNavigate();
  const [isSeller, setIsSeller] = useState(false);
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    setIsSeller(role === "seller");
  }, [role]);

  const handleLogout = () => {
    localStorage.removeItem('Auth');
    setLoggedIn(false);
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-teal-700 to-teal-900 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/home" className="flex items-center">
              <span className="text-2xl font-extrabold text-white tracking-wider bg-teal-800 py-1 px-3 rounded-lg shadow-md transform transition hover:scale-105">FASHORA</span>
            </Link>
          </div>
          {/* Desktop Navigation */}
          {loggedIn && isSeller && (
          
          <div className="hidden md:flex items-center space-x-4">
          <Link to="/home" className="text-gray-200 hover:bg-teal-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300">Home</Link>
            <Link to="/company" className="text-gray-200 hover:bg-teal-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300 flex items-center">
              <FaStore className="mr-1" /> Seller Dashboard
            </Link>
        </div>
          )}
          
          

          {/* Right Side Items */}
          <div className="hidden md:flex items-center space-x-4">
            {loggedIn ? (
              <>
                <Link to="/cart" className="text-white hover:text-teal-200 transition duration-300">
                  <div className="relative">
                    <FaShoppingCart className="text-xl" />
                    {/* <span className="absolute -top-2 -right-2 bg-yellow-500 text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      
                    </span> */}
                  </div>
                </Link>
                
                <div className="relative">
                  <div 
                    className="flex items-center cursor-pointer space-x-2 group"
                    onClick={() => setIsPopoverVisible(!isPopoverVisible)}
                  >
                    <div className="w-8 h-8 rounded-full bg-teal-800 flex items-center justify-center text-white border-2 border-teal-500">
                      {username.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-white text-sm font-medium hidden lg:block">{username}</span>
                    <FaChevronDown className="text-white text-xs ml-1" />
                  </div>
                  
                  {isPopoverVisible && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5 transform transition duration-200 ease-in-out">
                      <Link to="/profile" onClick={()=>{setIsPopoverVisible(!isPopoverVisible)}} className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-100 transition duration-200">
                        Profile
                      </Link>
                      <Link to="/myorders" onClick={()=>{setIsPopoverVisible(!isPopoverVisible)}} className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-100 transition duration-200">
                        My Orders
                      </Link>
                      <button 
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition duration-200"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link to="/" className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-md font-medium transition duration-300">
                Login
              </Link>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            {loggedIn && (
              <Link to="/cart" className="text-white hover:text-teal-200 transition duration-300 mr-4">
                <div className="relative">
                  <FaShoppingCart className="text-xl" />
                  <span className="absolute -top-2 -right-2 bg-yellow-500 text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    3
                  </span>
                </div>
              </Link>
            )}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-teal-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/home"     onClick={()=>{setIsMobileMenuOpen(!isMobileMenuOpen)}} className="text-gray-200 hover:bg-teal-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Home</Link>
            <Link to="/products" onClick={()=>{setIsMobileMenuOpen(!isMobileMenuOpen)}} className="text-gray-200 hover:bg-teal-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Products</Link>
            {isSeller && (
              <Link to="/seller-dashboard" onClick={()=>{setIsMobileMenuOpen(!isMobileMenuOpen)}}  className="text-gray-200 hover:bg-teal-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center">
                <FaStore className="mr-2" /> Seller Dashboard
              </Link>
            )}
            
            {loggedIn ? (
              <>
                <div className="border-t border-teal-700 pt-2 pb-1">
                  <div className="flex items-center px-3">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-teal-600 flex items-center justify-center border-2 border-teal-300">
                        {username.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-white">{username}</div>
                    </div>
                  </div>
                </div>
                <Link to="/profile" className="text-gray-200 hover:bg-teal-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Profile</Link>
                <Link to="/orders" className="text-gray-200 hover:bg-teal-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium">My Orders</Link>
                <button 
                  className="text-gray-200 hover:bg-red-600 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/" className="bg-teal-600 hover:bg-teal-500 text-white block px-3 py-2 rounded-md text-base font-medium">Login</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;