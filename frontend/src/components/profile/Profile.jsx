import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import route from "../route";

const Profile = ({ setUsername, setRole, loggedIn, role, setLoggedIn }) => {
  const value = localStorage.getItem('Auth');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingAddresses, setIsEditingAddresses] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [profile, setProfile] = useState({});
  const [countCart, setCountCart] = useState(0);
  const [countWishlist, setCountWishlist] = useState(0);
  const [countOrders, setCountOrders] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    getEssentials();
  }, []);

  useEffect(() => {
    if (role === "seller") {
      setIsSeller(true);
    }
  }, [role]);

  const getEssentials = async () => {
    try {
      const { status, data } = await axios.get(`${route()}profile`, {
        headers: { "Authorization": `Bearer ${value}` }
      });

      if (status === 200) {
        setUsername(data.username);
        setRole(data.role);
        setLoggedIn(true);
        if (data.profile)
          setProfile({ ...data.profile });
        if (data.address)
          setAddresses(data.address.addresses);
        setCountCart(data.cart);
        setCountWishlist(data.wishlist);
        setCountOrders(data.orders);
      }
    } catch (error) {
      console.log("error fetching profile data", error);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitProfile = async () => {
    if (isEditingProfile) {
      try {
        const { status, data } = await axios.post(
          `${route()}edituser`,
          profile,
          { headers: { "Authorization": `Bearer ${value}` } }
        );

        if (status === 201) {
          alert(data.msg);
        } else {
          alert("An error occurred while updating profile");
        }
      } catch (error) {
        alert("Failed to update profile");
      }
    }
    setIsEditingProfile(!isEditingProfile);
  };

  const handleAddressChange = (index, e) => {
    const { name, value } = e.target;
    const updatedAddresses = [...addresses];
    updatedAddresses[index] = {
      ...updatedAddresses[index],
      [name]: value,
    };
    setAddresses(updatedAddresses);
  };

  const handleAddAddress = () => {
    setAddresses([
      {
        houseNumber: "",
        houseName: "",
        place: "",
        pincode: "",
        postOffice: "",
        city: "",
        phone: "",
        name: ""
      },
      ...addresses,
    ]);
    setIsEditingAddresses(true);
  };

  const handleSubmitAddress = async () => {
    if (isEditingAddresses) {
      try {
        const { status, data } = await axios.post(
          `${route()}editaddress`,
          addresses,
          { headers: { "Authorization": `Bearer ${value}` } }
        );

        if (status === 201) {
          alert(data.msg);
        } else {
          alert("An error occurred while updating addresses");
        }
      } catch (error) {
        alert("Failed to update addresses");
      }
    }
    setIsEditingAddresses(!isEditingAddresses);
  };

  const handleLogout = () => {
    localStorage.removeItem('Auth');
    navigate('/');
    setLoggedIn(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 py-6 px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center">
              <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-md">
                <img
                  className="h-14 w-14 rounded-full object-cover"
                  src="./images/profile.png"
                  alt="Profile"
                />
              </div>
              <div className="ml-4 text-white">
                <div className="text-sm font-medium">Hello,</div>
                <div className="text-xl font-bold">
                  {profile.fname ? `${profile.fname} ${profile.lname}` : "Flipkart Customer"}
                </div>
              </div>
            </div>

            <div className="mt-4 md:mt-0 flex gap-4">
              {isSeller && (
                <Link to="/company">
                  <button className="bg-white text-blue-600 font-medium py-2 px-4 rounded-lg hover:bg-blue-50 transition duration-300 shadow-md">
                    Seller Dashboard
                  </button>
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-white text-red-600 font-medium py-2 px-4 rounded-lg hover:bg-red-50 transition duration-300 shadow-md"
              >
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* User Activity Stats */}
        <div className="grid grid-cols-3 divide-x divide-gray-200 bg-gray-50">
          <Link to="/mywishlist" className="p-4 flex flex-col items-center hover:bg-gray-100 transition duration-300">
            <div className="text-lg font-medium text-gray-700">Wishlist</div>
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
              <span className="text-blue-600 font-semibold">{countWishlist}</span>
            </div>
          </Link>
          <Link to="/myorders" className="p-4 flex flex-col items-center hover:bg-gray-100 transition duration-300">
            <div className="text-lg font-medium text-gray-700">Orders</div>
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
              <span className="text-blue-600 font-semibold">{countOrders}</span>
            </div>
          </Link>
          <Link to="/cart" className="p-4 flex flex-col items-center hover:bg-gray-100 transition duration-300">
            <div className="text-lg font-medium text-gray-700">Cart</div>
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
              <span className="text-blue-600 font-semibold">{countCart}</span>
            </div>
          </Link>
        </div>

        {/* Profile Information */}
        <div className="p-6 md:p-8 border-b border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
            <button
              onClick={handleSubmitProfile}
              className={`px-4 py-2 rounded-lg font-medium ${isEditingProfile
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-blue-600 text-white hover:bg-blue-700"
                } transition duration-300`}
            >
              {isEditingProfile ? "Save Profile" : "Edit Profile"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">First Name</label>
              <input
                type="text"
                name="fname"
                value={profile.fname || ""}
                onChange={handleProfileChange}
                disabled={!isEditingProfile}
                className={`w-full p-3 border rounded-lg ${isEditingProfile ? "border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" : "bg-gray-50 border-gray-200"
                  } transition duration-300`}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Last Name</label>
              <input
                type="text"
                name="lname"
                value={profile.lname || ""}
                onChange={handleProfileChange}
                disabled={!isEditingProfile}
                className={`w-full p-3 border rounded-lg ${isEditingProfile ? "border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" : "bg-gray-50 border-gray-200"
                  } transition duration-300`}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Phone</label>
              <input
                type="text"
                name="phone"
                value={profile.phone || ""}
                onChange={handleProfileChange}
                disabled={!isEditingProfile}
                className={`w-full p-3 border rounded-lg ${isEditingProfile ? "border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" : "bg-gray-50 border-gray-200"
                  } transition duration-300`}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={profile.email || ""}
                onChange={handleProfileChange}
                disabled={!isEditingProfile}
                className={`w-full p-3 border rounded-lg ${isEditingProfile ? "border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" : "bg-gray-50 border-gray-200"
                  } transition duration-300`}
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-gray-700 font-medium mb-2">Gender</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={profile.gender === "male"}
                  onChange={handleProfileChange}
                  disabled={!isEditingProfile}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Male</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={profile.gender === "female"}
                  onChange={handleProfileChange}
                  disabled={!isEditingProfile}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Female</span>
              </label>
            </div>
          </div>
        </div>

        {/* Addresses Section */}
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">My Addresses</h2>
            <button
              onClick={handleAddAddress}
              className="px-4 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition duration-300"
            >
              Add New Address
            </button>
          </div>

          {addresses.length === 0 ? (
            <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-500">
              No addresses added yet. Click "Add New Address" to add your first address.
            </div>
          ) : (
            <div className="space-y-6">
              {addresses.map((address, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                    <div className="font-medium text-blue-600">
                      {address.name ? `Address of ${address.name}` : "New Address"}
                    </div>
                    <button
                      onClick={handleSubmitAddress}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${isEditingAddresses
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                        } transition duration-300`}
                    >
                      {isEditingAddresses ? "Save Address" : "Edit Address"}
                    </button>
                  </div>

                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">Name</label>
                        <input
                          type="text"
                          name="name"
                          placeholder="Full Name"
                          value={address.name || ""}
                          onChange={(e) => handleAddressChange(index, e)}
                          disabled={!isEditingAddresses}
                          className={`w-full p-2 border rounded-md ${isEditingAddresses ? "border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" : "bg-gray-50 border-gray-200"
                            } transition duration-300`}
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">Phone</label>
                        <input
                          type="text"
                          name="phone"
                          placeholder="Phone Number"
                          value={address.phone || ""}
                          onChange={(e) => handleAddressChange(index, e)}
                          disabled={!isEditingAddresses}
                          className={`w-full p-2 border rounded-md ${isEditingAddresses ? "border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" : "bg-gray-50 border-gray-200"
                            } transition duration-300`}
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">House Number</label>
                        <input
                          type="text"
                          name="houseNumber"
                          placeholder="House Number"
                          value={address.houseNumber || ""}
                          onChange={(e) => handleAddressChange(index, e)}
                          disabled={!isEditingAddresses}
                          className={`w-full p-2 border rounded-md ${isEditingAddresses ? "border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" : "bg-gray-50 border-gray-200"
                            } transition duration-300`}
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">House Name</label>
                        <input
                          type="text"
                          name="houseName"
                          placeholder="House Name"
                          value={address.houseName || ""}
                          onChange={(e) => handleAddressChange(index, e)}
                          disabled={!isEditingAddresses}
                          className={`w-full p-2 border rounded-md ${isEditingAddresses ? "border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" : "bg-gray-50 border-gray-200"
                            } transition duration-300`}
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">Place</label>
                        <input
                          type="text"
                          name="place"
                          placeholder="Place"
                          value={address.place || ""}
                          onChange={(e) => handleAddressChange(index, e)}
                          disabled={!isEditingAddresses}
                          className={`w-full p-2 border rounded-md ${isEditingAddresses ? "border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" : "bg-gray-50 border-gray-200"
                            } transition duration-300`}
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">Post Office</label>
                        <input
                          type="text"
                          name="postOffice"
                          placeholder="Post Office"
                          value={address.postOffice || ""}
                          onChange={(e) => handleAddressChange(index, e)}
                          disabled={!isEditingAddresses}
                          className={`w-full p-2 border rounded-md ${isEditingAddresses ? "border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" : "bg-gray-50 border-gray-200"
                            } transition duration-300`}
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">City</label>
                        <input
                          type="text"
                          name="city"
                          placeholder="City"
                          value={address.city || ""}
                          onChange={(e) => handleAddressChange(index, e)}
                          disabled={!isEditingAddresses}
                          className={`w-full p-2 border rounded-md ${isEditingAddresses ? "border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" : "bg-gray-50 border-gray-200"
                            } transition duration-300`}
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">Pin Code</label>
                        <input
                          type="text"
                          name="pincode"
                          placeholder="Pin Code"
                          value={address.pincode || ""}
                          onChange={(e) => handleAddressChange(index, e)}
                          disabled={!isEditingAddresses}
                          className={`w-full p-2 border rounded-md ${isEditingAddresses ? "border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" : "bg-gray-50 border-gray-200"
                            } transition duration-300`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;