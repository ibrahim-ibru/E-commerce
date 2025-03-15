import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaEdit, FaSave, FaTags } from 'react-icons/fa';
import { BsFillBuildingsFill } from "react-icons/bs";
import route from "../route";
import { Link } from 'react-router-dom';

const Company = ({ setUsername, setRole, setLoggedIn }) => {
  const value = localStorage.getItem("Auth");
  const [company, setCompany] = useState({
    name: "",
    location: "",
    gstin: "",
    contact: ""
  });
  const [categories, setCategories] = useState([]);
  const [isEditable, setIsEditable] = useState(false);
  
  useEffect(() => {
    getEssentials();
  }, []);

  const getEssentials = async () => {
    try {
      const { status, data } = await axios.get(`${route()}company`, { 
        headers: { "Authorization": `Bearer ${value}` } 
      });
      if (status === 200) {
        setUsername(data.username);
        setRole(data.role);
        setLoggedIn(true);
        if (data.company) setCompany(data.company);
        if (data.category && data.category.length > 0) {
          setCategories(data.category[0].categories);
        }
      }
    } catch (error) {
      console.error("Error fetching company data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompany((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditClick = () => {
    setIsEditable(true);
  };

  const handleSave = async () => {
    if (isEditable) {
      try {
        const { status, data } = await axios.post(
          `${route()}editcompany`, 
          company, 
          { headers: { "Authorization": `Bearer ${value}` } }
        );
        if (status === 201) {
          alert(data.msg);
        } else {
          alert("Error saving company details");
        }
      } catch (error) {
        console.error("Save error:", error);
        alert("An error occurred while saving");
      }
      setIsEditable(false);
    } else {
      setIsEditable(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
          {/* Company Info Panel */}
          <div className="w-full md:w-2/5 bg-gradient-to-br from-gray-800 to-gray-900 text-white p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-full mb-4 border-2 border-blue-400/30 shadow-lg">
                <BsFillBuildingsFill size={60} className="text-blue-400" />
              </div>
              
              {!isEditable ? (
                <button 
                  className="bg-blue-600 text-white py-2 px-6 rounded-full flex items-center gap-2 transition-all duration-300 hover:bg-blue-700 hover:shadow-md transform hover:-translate-y-1"
                  onClick={handleEditClick}
                >
                  <FaEdit /> Edit Details
                </button>
              ) : (
                <button 
                  className="bg-green-600 text-white py-2 px-6 rounded-full flex items-center gap-2 transition-all duration-300 hover:bg-green-700 hover:shadow-md transform hover:-translate-y-1"
                  onClick={handleSave}
                >
                  <FaSave /> Save Changes
                </button>
              )}
            </div>

            <div className="space-y-5">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">Company Name</label>
                <input 
                  type="text" 
                  value={company.name} 
                  name="name"
                  onChange={handleChange} 
                  disabled={!isEditable}
                  className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white disabled:opacity-70 transition-all"
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">Location</label>
                <input 
                  type="text" 
                  name="location"
                  value={company.location} 
                  onChange={handleChange} 
                  disabled={!isEditable}
                  className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white disabled:opacity-70 transition-all"
                  placeholder="Enter location"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">GSTIN</label>
                <input 
                  type="text" 
                  name="gstin"
                  value={company.gstin} 
                  onChange={handleChange} 
                  disabled={!isEditable}
                  className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white disabled:opacity-70 transition-all"
                  placeholder="Enter GSTIN number"
                />
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">Contact</label>
                <input 
                  type="text" 
                  name="contact"
                  value={company.contact} 
                  onChange={handleChange} 
                  disabled={!isEditable}
                  className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white disabled:opacity-70 transition-all"
                  placeholder="Enter contact information"
                />
              </div>
            </div>
          </div>

          {/* Categories Panel */}
          <div className="w-full md:w-3/5 bg-white p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 border-b pb-4">
              <div className="flex items-center mb-4 sm:mb-0">
                <FaTags className="text-blue-600 mr-2" size={24} />
                <h3 className="text-2xl font-semibold text-gray-800">Product Categories</h3>
              </div>
              
              <div className="flex flex-wrap items-center gap-4">
                <Link 
                  to="/orders" 
                  className="text-gray-700 hover:text-blue-600 transition-colors flex items-center"
                >
                  Orders
                </Link>
                <span className="hidden sm:inline text-gray-400">|</span>
                <span className="text-gray-700">Products</span>
                
                <Link 
                  to="/addproduct" 
                  className="ml-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-all hover:shadow-md transform hover:-translate-y-1"
                  title="Add New Product"
                >
                  <FaPlus />
                </Link>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {categories.length > 0 ? (
                categories.map((category, index) => (
                  <Link 
                    to={`/products/${encodeURIComponent(category)}`} 
                    key={index} 
                    className="bg-gray-100 text-gray-800 py-2 px-4 rounded-full text-sm transition-all hover:bg-blue-100 hover:text-blue-700 hover:shadow border border-transparent hover:border-blue-200"
                  >
                    {category}
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 italic">No categories available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Company;