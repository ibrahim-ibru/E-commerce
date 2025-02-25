import React, { useState, useRef, useEffect } from 'react';
import { Filter, Search, Heart, ShoppingCart, User, Menu, X, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductCard = ({ color, price, originalPrice, isDiscount }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm transition-transform hover:shadow-md">
    {isDiscount && (
      <div className="bg-red-800 text-white w-16 text-center text-sm py-1 mb-2">-30%</div>
    )}
    <div className={`bg-${color}-100 h-48 sm:h-56 lg:h-48 xl:h-56 rounded-lg mb-4 relative`}>
      <img src="/api/placeholder/300/200" alt="Suede XL Sneaker" className="w-full h-full object-cover rounded-lg" />
    </div>
    <h3 className="text-base lg:text-lg font-medium mb-2">Suede XL Unisex Sneakers</h3>
    <div className="flex items-center gap-2">
      <span className="text-lg font-bold">₹{price}</span>
      {originalPrice && (
        <span className="text-gray-500 line-through text-sm">₹{originalPrice}</span>
      )}
    </div>
    <p className="text-red-600 text-xs lg:text-sm mt-1">Extra 10% off auto applied at checkout</p>
    <div className="bg-blue-700 text-white text-center py-1 mt-2 text-sm">BEST SELLER</div>
  </div>
);

const MobileMenu = ({ isOpen, onClose }) => {
  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className={`fixed inset-y-0 left-0 w-64 bg-white transform transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4">
          <button onClick={onClose} className="absolute top-4 right-4">
            <X className="h-6 w-6" />
          </button>
          <div className="space-y-4 mt-8">
            <div className="flex items-center">New <span className="ml-1">⚡</span></div>
            <div>Men</div>
            <div>Women</div>
            <div>Sports</div>
            <div>Motorsport</div>
            <div>Collaborations</div>
            <div>Kids</div>
            <div>Outlet</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FilterDropdown = ({ isOpen, onClose }) => {
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div 
      ref={dropdownRef}
      className={`absolute top-full left-0 mt-2 w-72 bg-white border rounded-lg shadow-lg z-50 transform transition-all duration-200 ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
      }`}
    >
      <div className="p-4">
        {/* Price Range */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Price Range</h3>
          <div className="space-y-2">
            <label className="flex items-center hover:bg-gray-50 p-2 rounded cursor-pointer">
              <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
              <span className="ml-3">Under ₹2,000</span>
            </label>
            <label className="flex items-center hover:bg-gray-50 p-2 rounded cursor-pointer">
              <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
              <span className="ml-3">₹2,000 - ₹5,000</span>
            </label>
            <label className="flex items-center hover:bg-gray-50 p-2 rounded cursor-pointer">
              <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
              <span className="ml-3">₹5,000 - ₹10,000</span>
            </label>
            <label className="flex items-center hover:bg-gray-50 p-2 rounded cursor-pointer">
              <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
              <span className="ml-3">Above ₹10,000</span>
            </label>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Categories</h3>
          <div className="space-y-2">
            <label className="flex items-center hover:bg-gray-50 p-2 rounded cursor-pointer">
              <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
              <span className="ml-3">Sneakers</span>
            </label>
            <label className="flex items-center hover:bg-gray-50 p-2 rounded cursor-pointer">
              <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
              <span className="ml-3">Running Shoes</span>
            </label>
            <label className="flex items-center hover:bg-gray-50 p-2 rounded cursor-pointer">
              <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
              <span className="ml-3">Casual Shoes</span>
            </label>
          </div>
        </div>

        {/* Color */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Color</h3>
          <div className="grid grid-cols-4 gap-2">
            <div className="flex flex-col items-center space-y-1">
              <button className="w-8 h-8 rounded-full bg-black border-2 border-transparent hover:border-gray-400 focus:border-gray-400"></button>
              <span className="text-xs">Black</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <button className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 hover:border-gray-400 focus:border-gray-400"></button>
              <span className="text-xs">White</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <button className="w-8 h-8 rounded-full bg-red-500 border-2 border-transparent hover:border-gray-400 focus:border-gray-400"></button>
              <span className="text-xs">Red</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <button className="w-8 h-8 rounded-full bg-blue-500 border-2 border-transparent hover:border-gray-400 focus:border-gray-400"></button>
              <span className="text-xs">Blue</span>
            </div>
          </div>
        </div>

        {/* Size */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Size</h3>
          <div className="grid grid-cols-4 gap-2">
            {[6, 7, 8, 9, 10, 11, 12].map(size => (
              <button
                key={size}
                className="px-2 py-1 border rounded hover:bg-gray-50 focus:bg-gray-50 focus:border-black"
              >
                UK {size}
              </button>
            ))}
          </div>
        </div>

        {/* Apply Filters Button */}
        <button className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors">
          Apply Filters
        </button>
      </div>
    </div>
  );
};

const PumaStore = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userdetails, setUserdetails] = useState({});
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  
  // Fixed getUserInitial function to use userdetails instead of user
  const getUserInitial = () => {
    return userdetails?.name ? userdetails.name.charAt(0).toUpperCase() : "U";
  };
  
  // Added option to toggle profile dropdown
  const handleUserIconClick = () => {
    if (isLoggedIn) {
      setIsProfileDropdownOpen(!isProfileDropdownOpen);
    } else {
      navigate('/userlogin');
    }
  };

  // Fixed getUser function to log response.data directly 
  const getUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("No token found");
        setIsLoggedIn(false);
        return;
      }
      
      const response = await axios.get('http://localhost:3000/api/getuser', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.status === 200) {
        console.log("User data from API:", response.data);
        setUserdetails(response.data);
        setIsLoggedIn(true);
      } else {
        console.log("Invalid response status:", response.status);
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setIsLoggedIn(false);
    }
  };
  
  useEffect(() => {
    getUser();
  }, []);
  
  useEffect(() => {
    console.log("Updated userdetails state:", userdetails);
  }, [userdetails]);
  
  const profileDropdownRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    
    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-black text-white p-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <button className="lg:hidden mr-4" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>
            <img src="/api/placeholder/40/40" alt="PUMA Logo" className="h-8" />
          </div>

          <div className="hidden lg:flex items-center space-x-8">
            <div className="flex space-x-6">
              <span className="flex items-center">New <span className="ml-1">⚡</span></span>
              <span>Men</span>
              <span>Women</span>
              <span>Sports</span>
              <span>Kids</span>
            </div>
          </div>

          <div className="flex items-center space-x-4 lg:space-x-6">
            <div className="hidden sm:block relative">
              <Search className="absolute left-3 top-2 h-5 w-5" />
              <input
                type="text"
                placeholder="SEARCH"
                className="bg-gray-800 pl-10 pr-4 py-1 rounded-sm w-48"
              />
            </div>
            <Heart className="h-6 w-6 cursor-pointer hover:text-gray-300" />
            <ShoppingCart className="h-6 w-6 cursor-pointer hover:text-gray-300" />
            <div className="relative" ref={profileDropdownRef}>
              <button 
                onClick={handleUserIconClick}
                className="group relative"
                aria-label={isLoggedIn ? "Profile menu" : "Login"}
              >
              {/* {isLoggedIn ? (
                <div className=" h-12 w-12  bg-red-500 border-1 border-gray-600 rounded-full flex items-center justify-center">
                <span className="font-medium ">{getUserInitial()}</span>
                
              </div>
              ) : (
                
              )
              )} */}
                <User className="h-6 w-6 cursor-pointer hover:text-gray-300" />
                {/* Tooltip */}
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                  {isLoggedIn ? 'Profile' : 'Login'}
                </span>
              </button>
              
              {/* Profile Dropdown Menu */}
              {isLoggedIn && isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 text-sm text-gray-700 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-medium">Hello, {userdetails?.name || 'User'}</p>
                    <p className="text-xs text-gray-500">{userdetails?.email || ''}</p>
                  </div>
                  <a href="/profile" className="block px-4 py-2 hover:bg-gray-100">My Profile</a>
                  <a href="/orders" className="block px-4 py-2 hover:bg-gray-100">My Orders</a>
                  <a href="/wishlist" className="block px-4 py-2 hover:bg-gray-100">Wishlist</a>
                  <button 
                    onClick={() => {
                      localStorage.removeItem('token');
                      setIsLoggedIn(false);
                      setUserdetails({});
                      setIsProfileDropdownOpen(false);
                      navigate('/userlogin');
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Mobile Search */}
      <div className="sm:hidden p-4 bg-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-2 h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 rounded-md border"
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          {/* Filter Button with Dropdown */}
          <div className="relative">
            <button
              className="flex items-center space-x-2 px-4 py-2 border rounded-md bg-white hover:bg-gray-50"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter className="h-5 w-5" />
              <span>FILTERS</span>
              <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <FilterDropdown 
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <button
                className="w-full sm:w-auto flex items-center justify-between space-x-2 px-4 py-2 border rounded-md bg-white hover:bg-gray-50"
                onClick={() => setIsSortOpen(!isSortOpen)}
              >
                <span>SORT BY</span>
                <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
              </button>
              {isSortOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
                  <div className="py-1">
                    <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Price: Low to High</button>
                    <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Price: High to Low</button>
                    <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Newest First</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          <ProductCard color="blue" price="6,299" originalPrice="8,999" isDiscount={true} />
          <ProductCard color="red" price="8,999" originalPrice="8,999" isDiscount={false} />
          <ProductCard color="gray" price="8,999" originalPrice="8,999" isDiscount={false} />
          <ProductCard color="gray" price="6,299" originalPrice="8,999" isDiscount={true} />
        </div>
      </main>
    </div>
  );
};

export default PumaStore;