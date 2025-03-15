import React, { useEffect, useState } from 'react';
import route from '../route';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaCheck, FaTimes, FaFilter, FaBox, FaArrowLeft } from 'react-icons/fa';

const Sellorder = ({ setUsername, setRole, setLoggedIn }) => {
  const value = localStorage.getItem('Auth');
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDetails(statusFilter);
  }, [statusFilter]);

  const getDetails = async (status) => {
    setLoading(true);
    try {
      if (value !== null) {
        const res = await axios.get(`${route()}getsellorders`, {
          headers: { "Authorization": `Bearer ${value}` }
        });
        if (res.status === 200) {
          setUsername(res.data.username);
          setRole(res.data.role);
          setLoggedIn(true);
          const filteredOrders = res.data.orders.filter(order => order.status === status);
          setOrders(filteredOrders);
        }
      }
    } catch (error) {
      console.log("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const updateOrderStatus = async (buyerId, orderId, newStatus) => {
    try {
      const res = await axios.post(
        `${route()}updateorderstatus`,
        { 
          id: orderId,
          status: newStatus,
          buyerId: buyerId
        },
        {
          headers: {
            "Authorization": `Bearer ${value}`,
            "Content-Type": "application/json",
          }
        }
      );
      if (res.status === 201) {
        alert(res.data.msg);
        getDetails(statusFilter);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'approved': return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 pb-4 border-b">
            <div className="flex items-center mb-4 sm:mb-0">
              <FaBox className="text-teal-600 mr-3" size={24} />
              <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
            </div>
            
            <Link to="/company" className="text-gray-600 hover:text-teal-600 transition-colors flex items-center">
              <FaArrowLeft className="mr-2" /> Back to Dashboard
            </Link>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-center mb-8 gap-4">
            <div className="flex items-center bg-white shadow-md rounded-full px-5 py-2 border">
              <FaFilter className="text-teal-600 mr-2" />
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={handleStatusChange}
                className="bg-transparent text-gray-700 focus:outline-none cursor-pointer font-medium"
              >
                <option value="pending">Pending Orders</option>
                <option value="approved">Approved Orders</option>
                <option value="rejected">Rejected Orders</option>
              </select>
            </div>
            
            <div className="flex gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                statusFilter === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : 'bg-gray-100 text-gray-600 border-gray-200'
              }`}>
                Pending
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                statusFilter === 'approved' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-gray-100 text-gray-600 border-gray-200'
              }`}>
                Approved
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                statusFilter === 'rejected' ? 'bg-red-100 text-red-800 border-red-300' : 'bg-gray-100 text-gray-600 border-gray-200'
              }`}>
                Rejected
              </span>
            </div>
          </div>

          {/* Orders List */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <div 
                    key={order._id} 
                    className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all hover:shadow-lg hover:-translate-y-1"
                  >
                    <div className="relative">
                    <img 
  className="w-full h-48 object-cover"
  src={order.image || "https://via.placeholder.com/300x200?text=No+Image"} 
  alt={order.name} 
/>
                      <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{order.name}</h3>
                      <p className="text-gray-600 mb-2">{order.description}</p>
                      
                      <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                        <span>Quantity: {order.quantity}</span>
                        <span className="font-medium text-teal-600">${order.price}</span>
                      </div>
                      
                      <div className="pt-3 border-t border-gray-100">
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Buyer:</span> {order.buyerName}
                        </p>
                        <p className="text-sm text-gray-600 mb-4">
                          <span className="font-medium">Ordered:</span> {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        
                        {order.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => updateOrderStatus(order.buyerId, order._id, 'approved')}
                              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center"
                            >
                              <FaCheck className="mr-2" /> Approve
                            </button>
                            <button 
                              onClick={() => updateOrderStatus(order.buyerId, order._id, 'rejected')}
                              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center"
                            >
                              <FaTimes className="mr-2" /> Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 py-12 text-center">
                  <p className="text-gray-500 text-lg">No {statusFilter} orders found.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sellorder;