import React, { useEffect, useState } from 'react';
import { FaUserCircle, FaShoppingCart } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ username, role, loggedIn, setLoggedIn }) => {
  const navigate = useNavigate();
  const [isSeller, setIsSeller] = useState(false);
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  
  useEffect(() => {
    setIsSeller(role === "seller");
  }, [role]);

  const handleLogout = () => {
    localStorage.removeItem('Auth');
    setLoggedIn(false);
    navigate('/');
  };

  return (
    <div className="flex justify-between items-center px-[5%] py-4 bg-gradient-to-br from-[#34335d] to-[#43345e] text-white font-montserrat shadow-md relative">
      <div className="flex items-center">
        <Link to={'/home'}>
          <span className="text-lg font-bold tracking-wider text-gray-300 shadow-md p-2.5 px-3 rounded-lg transition-transform duration-300 hover:scale-105">FASHORA</span>
        </Link>
      </div>

      <div className="flex items-center gap-5">
        {loggedIn ? (
          <>
            <h4 className="font-semibold text-gray-100 mr-4">{username}</h4>
            <div className="relative">
              <img
                className="w-[45px] h-[45px] rounded-full border-3 border-[#3498db] cursor-pointer transition-transform duration-300 hover:scale-110"
                src="./profile.png"
                alt="Profile"
                onClick={() => setIsPopoverVisible(!isPopoverVisible)}
              />
              {isPopoverVisible && (
                <div className="absolute top-16 right-0 bg-white rounded-lg shadow-lg w-52 p-4 z-10 animate-fadeIn">
                  <Link to="/profile">
                    <button className="w-full py-2.5 px-4 mb-2.5 border-none rounded font-semibold bg-[#3498db] text-white transition-all duration-300 hover:translate-x-1 hover:shadow-md">Profile</button>
                  </Link>
                  <button 
                    className="w-full py-2.5 px-4 mb-2.5 border-none rounded font-semibold bg-[#e74c3c] text-white transition-all duration-300 hover:translate-x-1 hover:shadow-md"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            <Link to="/cart" className="flex items-center text-gray-100 font-semibold transition-colors duration-300 hover:text-[#2ecc71] hover:scale-105">
              CART
            </Link>
          </>
        ) : (
          <Link to="/" className="flex items-center text-gray-100 transition-transform duration-300 hover:scale-105">
            <img src="./images/profile.png" alt="Login" className="w-10 mr-2.5 rounded-full" />
            <p>Login</p>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;