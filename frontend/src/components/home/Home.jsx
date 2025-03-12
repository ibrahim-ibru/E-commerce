import React, { useEffect, useState } from 'react';
import route from '../route';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = ({ setUsername, setRole, setLoggedIn }) => {
  const value = localStorage.getItem('Auth');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);

  useEffect(() => {
    getDetails();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, minPrice, maxPrice]);

  const getDetails = async () => {
    try {
      if (value !== null) {
        const res = await axios.get(`${route()}home`, {
          headers: { Authorization: `Bearer ${value}` },
        });

        if (res.status === 200) {
          setUsername(res.data.username);
          setRole(res.data.role);
          setLoggedIn(true);
          setProducts(res.data.products);
          setFilteredProducts(res.data.products);
        } else if (res.status === 403) {
          setLoggedIn(false);
        }
      }
    } catch (error) {
      alert(error.response.data.msg);
      console.error('Error fetching product details:', error);
    }
  };

  const filterProducts = () => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.pname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice =
        product.price >= minPrice && product.price <= maxPrice;
      return matchesSearch && matchesPrice;
    });
    setFilteredProducts(filtered);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleMinPriceChange = (event) => {
    setMinPrice(Number(event.target.value));
  };

  const handleMaxPriceChange = (event) => {
    setMaxPrice(Number(event.target.value));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="flex flex-col items-center mb-8">
        <div className="w-full max-w-2xl">
          <input
            className="w-full p-3 border-2 border-gray-200 rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-blue-500"
            placeholder="Search Products..."
            type="search"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex gap-4 mt-4">
          <label className="flex items-center">
            <span className="mr-2 text-gray-800">Min Price:</span>
            <input
              type="number"
              className="p-2 border border-gray-200 rounded"
              value={minPrice}
              onChange={handleMinPriceChange}
            />
          </label>
          <label className="flex items-center">
            <span className="mr-2 text-gray-800">Max Price:</span>
            <input
              type="number"
              className="p-2 border border-gray-200 rounded"
              value={maxPrice}
              onChange={handleMaxPriceChange}
            />
          </label>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-5">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Link
              to={`/product/${product._id}`}
              key={product._id}
              className="text-inherit no-underline"
            >
              <div className="w-60 bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <div className="h-40 overflow-hidden rounded-t-xl">
                  <img
                    src={product.pimages[0]}
                    alt={product.pname}
                    className="w-full h-full object-cover p-3 rounded-tr-xl rounded-bl-none"
                  />
                </div>
                <div className="p-4 text-center">
                  <div className="text-yellow-900 text-xs uppercase tracking-wider mb-1">
                    {product.category.toUpperCase()}
                  </div>
                  <div className="text-olive-800 font-semibold mb-2 text-base">
                    {product.pname.substring(0, 20)}
                  </div>
                  <div className="text-green-700 font-bold text-lg">
                    ₹{product.price}
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="w-full text-center text-gray-800 text-lg mt-12">
            No products available
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;