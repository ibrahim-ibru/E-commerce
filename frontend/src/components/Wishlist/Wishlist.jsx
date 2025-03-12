import React, { useEffect, useState } from 'react';
import route from '../route';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Wishlist = ({ setUsername, setRole, setLoggedIn }) => {
  const value = localStorage.getItem('Auth');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getDetails();
  }, []);

  const getDetails = async () => {
    try {
      if (value !== null) {
        const res = await axios.get(`${route()}getwishlists`, {
          headers: { Authorization: `Bearer ${value}` },
        });
        if (res.status === 200) {
          setUsername(res.data.username);
          setRole(res.data.role);
          setLoggedIn(true);
          setProducts(res.data.products);
        }
      }
    } catch (error) {
      console.log('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <h1 className="text-center text-3xl font-bold text-blue-700 mb-10 tracking-widest relative">
        Wishlist Page
        <span className="block w-24 h-1 bg-green-500 mx-auto mt-2"></span>
      </h1>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products && products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} className="transition transform hover:scale-105 hover:shadow-lg">
              <Link to={`/product/${product._id}`}>
                <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition">
                  <div className="h-40 overflow-hidden">
                    <img
                      src={product.pimages[0]}
                      alt={product.pname}
                      className="w-full h-full object-cover transition duration-300 hover:scale-110"
                    />
                  </div>
                  <div className="p-4 text-center bg-gradient-to-t from-blue-700/50 to-transparent">
                    <span className="block text-gray-900 font-semibold uppercase">{product.category}</span>
                    <span className="block text-gray-800 font-medium text-lg mt-1">{product.pname.substring(0, 16)}</span>
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p className="text-center text-xl text-gray-500">No products available</p>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
