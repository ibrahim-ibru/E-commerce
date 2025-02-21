import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const [isOpen, setIsOpen] = useState(false);  // State for dropdown visibility
  const [activeCategory, setActiveCategory] = useState(null);  // Track the active category
  const dropdownRef = useRef(null);  // Ref for closing the dropdown when clicking outside
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setActiveCategory(null);  // Close subcategories when the dropdown is closed
    }
  };

  const handleCategoryClick = (category) => {
    // If the category is already active, toggle its visibility
    if (activeCategory === category) {
      setActiveCategory(null);
    } else {
      setActiveCategory(category);
    }
  };

  const handleSubcategoryClick = (subcategory) => {
    // Navigate or perform any action after selecting a subcategory
    console.log('Subcategory selected:', subcategory);
    setActiveCategory(null); // Close the dropdown after selection
    setIsOpen(false); // Close the dropdown as well
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setActiveCategory(null); // Reset the category selection if clicking outside
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="h-screen w-full">
      <nav className="bg-blue-500 h-23 w-full flex items-center justify-between px-6 border-b border-gray-300">
        <div className="font-bold text-5xl text-white">Logo</div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="border border-gray-300 rounded-full py-2 pl-10 pr-4 w-80 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            width="20"
            height="20"
          >
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM20 20l-4-4" />
          </svg>
        </div>

        <button
          onClick={() => navigate('/userlogin')}
          className="bg-white text-blue-500 font-bold py-2 px-6 rounded-full hover:bg-white hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
        >
          Login
        </button>
      </nav>

      {/* Body */}
      <div className="flex items-center justify-between bg-gray-100 h-160">
        {/* Left section - Product Categories Dropdown */}
        <div className="w-1/6 bg-blue-400 h-full">
          <div
            onClick={toggleDropdown}
            className="h-1/10 flex duration-300 items-center cursor-pointer justify-center relative m-auto mt-3 border-t border-b border-gray-100"
          >
            <span className="text-white text-2xl font-bold">Product Categories</span>

            {isOpen && (
              <div
                ref={dropdownRef}
                className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-300 shadow-lg rounded-lg transform transition-all duration-300 ease-in-out scale-100"
              >
                <ul className="py-2">
                  {/* Category 1 */}
                  <li
                    className="flex items-center px-4 py-3 hover:bg-blue-100 transition-all duration-200 cursor-pointer"
                    onClick={() => handleCategoryClick('electronics')}
                  >
                    <svg
                      className="w-5 h-5 text-blue-500 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M4 5l12 7-12 7V5z" />
                    </svg>
                    <span>Electronics</span>
                  </li>
                  {activeCategory === 'electronics' && (
                    <ul className="pl-8">
                      <li
                        className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                        onClick={() => handleSubcategoryClick('Smartphones')}
                      >
                        Smartphones
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                        onClick={() => handleSubcategoryClick('Laptops')}
                      >
                        Laptops
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                        onClick={() => handleSubcategoryClick('Accessories')}
                      >
                        Accessories
                      </li>
                    </ul>
                  )}

                  {/* Category 2 */}
                  <li
                    className="flex items-center px-4 py-3 hover:bg-blue-100 transition-all duration-200 cursor-pointer"
                    onClick={() => handleCategoryClick('fashion')}
                  >
                    <svg
                      className="w-5 h-5 text-blue-500 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M12 2L12 12 5 8z" />
                    </svg>
                    <span>Fashion</span>
                  </li>
                  {activeCategory === 'fashion' && (
                    <ul className="pl-8">
                      <li
                        className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                        onClick={() => handleSubcategoryClick('Men\'s Clothing')}
                      >
                        Men’s Clothing
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                        onClick={() => handleSubcategoryClick('Women\'s Clothing')}
                      >
                        Women’s Clothing
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                        onClick={() => handleSubcategoryClick('Footwear')}
                      >
                        Footwear
                      </li>
                    </ul>
                  )}

                  {/* Category 3 */}
                  <li
                    className="flex items-center px-4 py-3 hover:bg-blue-100 transition-all duration-200 cursor-pointer"
                    onClick={() => handleCategoryClick('home')}
                  >
                    <svg
                      className="w-5 h-5 text-blue-500 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M12 2L12 12 5 8z" />
                    </svg>
                    <span>Home Appliances</span>
                  </li>
                  {activeCategory === 'home' && (
                    <ul className="pl-8">
                      <li
                        className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                        onClick={() => handleSubcategoryClick('Refrigerators')}
                      >
                        Refrigerators
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                        onClick={() => handleSubcategoryClick('Microwaves')}
                      >
                        Microwaves
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                        onClick={() => handleSubcategoryClick('Air Conditioners')}
                      >
                        Air Conditioners
                      </li>
                    </ul>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right section */}
        <div className="w-5/6 p-8 h-full">
          <div className="flex items-center justify-center h-full">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h1 className="text-3xl font-bold mb-4">Welcome to Our Website</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
 