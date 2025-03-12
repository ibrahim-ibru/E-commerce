import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaEdit, FaSave } from 'react-icons/fa';
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
    <div className="flex justify-center p-5 bg-gray-100">
      <div className="flex flex-col md:flex-row w-full max-w-6xl bg-white rounded-lg shadow-md overflow-hidden">
        {/* Company Info Panel */}
        <div className="border-r-4 border-white bg-gray-400 text-gray-100 p-5 flex flex-col w-full md:w-2/5">
          <div className="flex justify-between items-center mb-5">
            <div className="text-blue-400 items-center ml-[40%] text-center border-2 border-gray-100 rounded-full p-5">
              <BsFillBuildingsFill size={60} />
            </div>

            <div>
              {!isEditable ? (
                <button 
                  className="bg-blue-600 text-white border-none py-2 px-4 rounded flex items-center gap-2 cursor-pointer transition-colors hover:bg-blue-700" 
                  onClick={handleEditClick}
                >
                  <FaEdit /> Edit
                </button>
              ) : (
                <button 
                  className="bg-blue-600 text-white border-none py-2 px-4 rounded flex items-center gap-2 cursor-pointer transition-colors hover:bg-blue-700" 
                  onClick={handleSave}
                >
                  <FaSave /> Save
                </button>
              )}
            </div>
          </div>

          <div>
            <div className="mb-4">
              <label className="block mb-1 text-sm">Company Name:</label>
              <input 
                type="text" 
                value={company.name} 
                name="name"
                onChange={handleChange} 
                disabled={!isEditable}
                className="w-full p-2 border border-gray-600 rounded bg-gray-100 text-gray-100 focus:outline-none focus:border-blue-500 disabled:bg-opacity-5 disabled:border-transparent"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 text-sm">Location:</label>
              <input 
                type="text" 
                name="location"
                value={company.location} 
                onChange={handleChange} 
                disabled={!isEditable}
                className="w-full p-2 border border-gray-600 rounded bg-gray-100 text-gray-100 focus:outline-none focus:border-blue-500 disabled:bg-opacity-5 disabled:border-transparent"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 text-sm">GSTIN:</label>
              <input 
                type="text" 
                name="gstin"
                value={company.gstin} 
                onChange={handleChange} 
                disabled={!isEditable}
                className="w-full p-2 border border-gray-600 rounded bg-gray-100 text-gray-100 focus:outline-none focus:border-blue-500 disabled:bg-opacity-5 disabled:border-transparent"
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-1 text-sm">Contact:</label>
              <input 
                type="text" 
                name="contact"
                value={company.contact} 
                onChange={handleChange} 
                disabled={!isEditable}
                className="w-full p-2 border border-gray-600 rounded bg-gray-100 text-gray-100 focus:outline-none focus:border-blue-500 disabled:bg-opacity-5 disabled:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Categories Panel */}
        <div className="bg-blue-500 p-5 w-full md:w-3/5">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-white text-2xl m-0">Categories</h3>
            <div className="flex items-center gap-4">
              <Link to="/orders" className="text-white no-underline text-base m-5">
                Orders Confirmation
              </Link>
              <p className="text-white">
                Products
              </p> 
              
              <Link to="/addproduct" className="text-yellow-800 bg-white rounded-full w-8 h-8 flex justify-center items-center transition-colors hover:bg-blue-700">
                <FaPlus />
              </Link>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-5">
            {categories.map((category, index) => (
              <Link 
                to={`/products/${encodeURIComponent(category)}`} 
                key={index} 
                className="bg-blue-400 text-white no-underline py-2 px-4 rounded-full text-sm transition-colors hover:bg-blue-600"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Company;