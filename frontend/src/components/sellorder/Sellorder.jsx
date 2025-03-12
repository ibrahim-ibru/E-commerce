import React, { useEffect, useState } from 'react';
import route from '../route';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Sellorder = ({ setUsername, setRole, setLoggedIn }) => {
  const value = localStorage.getItem('Auth');
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('pending');

  useEffect(() => {
    getDetails(statusFilter);
  }, [statusFilter]);

  const getDetails = async (status) => {
    try {
      if (value !== null) {
/*************  ✨ Codeium Command ⭐  *************/
/**
 * Fetches orders based on the given status and updates the state accordingly
 * @param {string} status The status of the orders to fetch (pending, approved, rejected)
 */
/******  6eed44b7-44fe-479f-ba21-61cb07c7bac0  *******/        const res = await axios.get(`${route()}getsellorders`, {
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

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center text-teal-700 mb-6">Orders</h1>

      {/* Status Filter Dropdown */}
      <div className="flex justify-center mb-4">
        <label className="mr-3 text-lg font-semibold">Choose:</label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={handleStatusChange}
          className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Orders List */}
      <div className="flex flex-wrap gap-6 justify-center">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order._id} className="w-72 bg-white rounded-lg shadow-md p-4">
              <div className="flex flex-col items-center">
                <img className="w-56 h-40 rounded-md object-cover" src={order.product.pimages[0]} alt={order.product.pname} />
                
                <div className="mt-3 text-center">
                  <span className="block text-gray-700 font-semibold">{order.product.category.toUpperCase()}</span>
                  <span className="block text-lg font-bold text-gray-900">{order.product.pname.substring(0, 16)}</span>
                  <span className="block text-sm text-gray-500">SIZE: {order.size}</span>

                  {/* Buttons for Pending Orders */}
                  {order.status === 'pending' && (
                    <div className="mt-3 flex space-x-4">
                      <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-800 transition-all"
                        onClick={() => updateOrderStatus(order.buyerId, order._id, 'approved')}
                      >
                        APPROVE
                      </button>
                      <button
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-800 transition-all"
                        onClick={() => updateOrderStatus(order.buyerId, order._id, 'rejected')}
                      >
                        REJECT
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-lg text-gray-600">No orders available for the selected status</p>
        )}
      </div>
    </div>
  );
};

export default Sellorder;
