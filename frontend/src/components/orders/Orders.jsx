import React, { useEffect, useState } from 'react';
import route from '../route';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Orders = ({ setUsername, setRole, setLoggedIn }) => {
  const value = localStorage.getItem('Auth');
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate=useNavigate()

  useEffect(() => {
    getDetails();
  }, []);

  const getDetails = async () => {
    try {
      setIsLoading(true);
      if (value !== null) {
        const res = await axios.get(`${route()}getorders`, {
          headers: { "Authorization": `Bearer ${value}` }
        });
        if (res.status === 200) {
          setUsername(res.data.username);
          setRole(res.data.role);
          setLoggedIn(true);
          setOrders(res.data.orders);
        }
      }
    } catch (error) {
      console.log("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyAgain = async (productId) => {
    try {
      if (value !== null) {
        
        navigate(`/scart/${productId}`)
        
        
      }
    } catch (error) {
      console.log("Error adding product to cart:", error);
      alert("Failed to purchase again");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with gradient background */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-800 rounded-lg opacity-10"></div>
        <h1 className="text-center py-6 text-3xl md:text-4xl lg:text-5xl font-bold text-indigo-800 relative z-10">
          My Purchase History
        </h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-800"></div>
        </div>
      ) : orders && orders.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {orders.map((order) => (
            <div key={order._id} className="group">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
                <Link to={`/product/${order.product._id}`}>
                  <div className="relative pt-4 px-4">
                    <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-lg">
                      <img
                        src={order.product.pimages[0]}
                        alt={order.product.pname}
                        className="w-full h-48 object-cover transform transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute top-6 right-6 bg-indigo-600 text-white text-xs font-bold rounded-full px-2 py-1 uppercase">
                      {order.product.category}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800 truncate">{order.product.pname}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Purchased on {new Date(order.createdAt || Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
                <div className="px-4 pb-4">
                  <button
                    onClick={() => handleBuyAgain(order.product._id)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Buy Again
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg py-12 px-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No orders yet</h3>
          <p className="mt-2 text-gray-500">Looks like you haven't made any purchases yet.</p>
          <div className="mt-6">
            <Link to="/products" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Browse Products
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;