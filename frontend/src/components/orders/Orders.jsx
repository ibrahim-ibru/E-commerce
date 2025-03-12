import React, { useEffect, useState } from 'react';
import route from '../route';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Orders = ({ setUsername, setRole, setLoggedIn }) => {
  const value = localStorage.getItem('Auth');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getDetails();
  }, []);

  const getDetails = async () => {
    try {
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
      console.log("error");
    }
  };

  return (
    <div className="pt-5">
      <h1 className="w-full text-center text-4xl text-[#340f93] font-bold">My Purchase ...</h1>
      <div className="w-full flex flex-wrap gap-5 m-5">
        {orders && orders.length > 0 ? (
          orders.map((order) => (
            <div key={order._id} className="order-card">
              <Link to={`/product/${order.product._id}`}>
                <div>
                  <div className="shadow-lg p-5 w-64 h-64 transition-all duration-100 ease-in-out relative">
                    <div className="image">
                      <img 
                        src={order.product.pimages[0]} 
                        alt="" 
                        className="w-56 h-40 rounded-lg object-cover ml-0.5 bg-cover"
                      />
                    </div>
                    <div className="w-4/5 text-center absolute top-[62%] left-[9%]">
                      <span className="text-black text-2xl font-bold mb-2.5">
                        {order.product.category.toUpperCase()}
                      </span>
                      <br/>
                      <span className="text-black text-2xl font-bold mb-2.5">
                        {order.product.pname.substring(0,16)}
                      </span>
                      <br/>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p className="text-center text-lg text-gray-700 opacity-60 mt-8">No orders available</p>
        )}
      </div>
    </div>
  );
};

export default Orders;