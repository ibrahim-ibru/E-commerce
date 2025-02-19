import React, { useState } from "react";
import { FaSearch, FaUserCircle } from "react-icons/fa"; // For Search Icon and Profile Circle

const HomePage = () => {
  const [isSeller, setIsSeller] = useState(true); // Mock seller/buyer login status
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Toggle dropdown menu
  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <div className="bg-gray-100">
      {/* Navbar */}
      <header className="bg-blue-800 text-white p-4">
        <div className="flex items-center justify-between max-w-screen-xl mx-auto">
          <div className="flex items-center space-x-4">
            {/* Username and Seller Button */}
            <span className="text-lg font-semibold">John Doe</span>
            <button className="bg-yellow-500 text-black px-4 py-2 rounded-md">Seller</button>
          </div>

          {/* Center Search Bar */}
          <div className="relative w-1/3">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2 rounded-md focus:outline-none"
            />
            <FaSearch className="absolute right-3 top-3 text-gray-500" />
          </div>

          {/* Profile Circle */}
          <div className="relative">
            <div
              className="w-10 h-10 bg-gray-700 text-white rounded-full flex items-center justify-center cursor-pointer"
              onClick={toggleProfileMenu}
            >
              J
            </div>
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md w-40">
                <ul>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Logout</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex py-8 px-4 max-w-screen-xl mx-auto">
        {/* Left Sidebar (30%) */}
        <div className="w-1/3 space-y-4">
          {isSeller && (
            <>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md w-full">
                View Seller Products Updates
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md w-full">
                Add More Products
              </button>
            </>
          )}

          {/* Requests/Orders */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Requests</h3>
            <select className="w-full mt-2 p-2 rounded-md border border-gray-300">
              <option value="1">Request 1</option>
              <option value="2">Request 2</option>
              <option value="3">Request 3</option>
            </select>
            {isSeller ? (
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 w-full">
                View Orders
              </button>
            ) : (
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 w-full">
                My Orders
              </button>
            )}
          </div>
        </div>

        {/* Right Content (70%) */}
        <div className="w-2/3 space-y-6">
          {/* Product Cards Section */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <img
                src="https://via.placeholder.com/200"
                alt="Product 1"
                className="w-full h-40 object-cover mb-4 rounded"
              />
              <h3 className="text-lg font-semibold">Product 1</h3>
              <p className="text-gray-500">$50</p>
              <button className="bg-blue-500 text-white mt-4 w-full py-2 rounded-md">Add to Cart</button>
            </div>
            {/* More Product Cards */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <img
                src="https://via.placeholder.com/200"
                alt="Product 2"
                className="w-full h-40 object-cover mb-4 rounded"
              />
              <h3 className="text-lg font-semibold">Product 2</h3>
              <p className="text-gray-500">$100</p>
              <button className="bg-blue-500 text-white mt-4 w-full py-2 rounded-md">Add to Cart</button>
            </div>
            {/* Add more product cards as needed */}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-800 text-white py-6">
        <div className="max-w-screen-xl mx-auto text-center">
          <p>&copy; 2025 ShopEase - All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
