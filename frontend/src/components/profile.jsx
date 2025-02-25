import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    email: 'mohammedibrahim2k02@gmail.com',
    mobile: '+917025807876'
  });

  const [dropdownOpen, setDropdownOpen] = useState(false); // State to control dropdown visibility
  const navigate = useNavigate();
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const handleSave = () => {
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const navigateToHome = () => {
    navigate('/');
};

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/userlogin');
    alert('Logged out');
    // Implement your logout functionality here (e.g., clear session, redirect to login, etc.)
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 via-purple-800 to-indigo-800 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Profile Dropdown Icon at Top-Right Corner */}
      <div className="absolute top-6 right-6">
        <button 
          onClick={toggleDropdown} 
          className="text-white flex items-center space-x-2 hover:scale-105 transition-transform"
        >
          <div className="w-10 h-10 bg-gradient-to-r from-pink-600 to-purple-500 rounded-full flex items-center justify-center shadow-xl transition-all duration-300">
            <span className="text-white font-semibold">P</span> {/* Profile Icon */}
          </div>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 bg-gradient-to-r from-blue-900 to-indigo-800 text-white rounded-lg shadow-2xl mt-2 w-40">
            <button 
              onClick={navigateToHome} 
              className="block w-full text-left px-4 py-2 hover:bg-blue-700 transition-colors"
            >
              Home
            </button>
            <button 
              onClick={handleLogout} 
              className="block w-full text-left px-4 py-2 hover:bg-blue-700 transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Main Profile Form */}
      <div className="bg-white/10 backdrop-filter backdrop-blur-md rounded-xl w-full max-w-3xl p-8 shadow-xl border border-white/20 space-y-8">
        <div className="space-y-6">
          {/* Header and Edit Button */}
          <div className="flex justify-between items-center pb-4 border-b border-white/20">
            <h1 className="text-3xl font-extrabold text-white tracking-wider">Personal Information</h1>
            <button 
              onClick={toggleEdit} 
              className="text-blue-400 hover:text-blue-300 transition"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={userData.firstName}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-white/5 border border-white/30 rounded-lg p-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />
            </div>
            <div>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={userData.lastName}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-white/5 border border-white/30 rounded-lg p-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />
            </div>
          </div>

          {/* Gender Selection */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Your Gender</h2>
            <div className="flex space-x-8">
              <label className="flex items-center space-x-3 cursor-pointer">
                <div className="w-6 h-6 rounded-full border-2 border-white/50 flex items-center justify-center">
                  {userData.gender === 'Male' && (
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  )}
                </div>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={userData.gender === 'Male'}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="hidden"
                />
                <span className="text-white text-lg">Male</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <div className="w-6 h-6 rounded-full border-2 border-white/50 flex items-center justify-center">
                  {userData.gender === 'Female' && (
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  )}
                </div>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={userData.gender === 'Female'}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="hidden"
                />
                <span className="text-white text-lg">Female</span>
              </label>
            </div>
          </div>

          {/* Email */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Email Address</h2>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full bg-white/5 border border-white/30 rounded-lg p-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
          </div>

          {/* Mobile */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Mobile Number</h2>
            <input
              type="tel"
              name="mobile"
              value={userData.mobile}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full bg-white/5 border border-white/30 rounded-lg p-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg transition-all duration-300 shadow-lg transform hover:scale-105"
              >
                SAVE
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
