import React, { useEffect, useState } from 'react';
import route from '../route';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Footer from '../Footer';

const Home = ({ setUsername, setRole, setLoggedIn }) => {
  const value = localStorage.getItem('Auth');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getDetails();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, minPrice, maxPrice, products]);

  const getDetails = async () => {
    setIsLoading(true);
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
      console.error('Error fetching product details:', error);
      if (error.response) {
        alert(error.response.data.msg);
      }
    } finally {
      setIsLoading(false);
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
    <>
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header section with search and filters */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
            Product Catalog
          </h1>
          
          {/* Search bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="Search products by name or category..."
              type="search"
              value={searchQuery}
              onChange={handleSearchChange}
              />
          </div>
          
          {/* Price filters */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
            <span className="font-medium text-gray-700">Price Range:</span>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center">
                <span className="mr-2 text-gray-600">Min:</span>
                <input
                  type="number"
                  className="p-2 w-24 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  value={minPrice}
                  onChange={handleMinPriceChange}
                />
              </label>
              <label className="flex items-center">
                <span className="mr-2 text-gray-600">Max:</span>
                <input
                  type="number"
                  className="p-2 w-24 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  value={maxPrice}
                  onChange={handleMaxPriceChange}
                  />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Products grid */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <Link
                  to={`/product/${product._id}`}
                    key={product._id}
                    className="text-inherit no-underline group"
                    >
                    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
                      <div className="h-48 overflow-hidden">
                        <img
                          src={product.pimages[0]}
                          alt={product.pname}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                      </div>
                      <div className="p-4 flex flex-col flex-grow">
                        <div className="text-xs font-semibold text-amber-700 bg-amber-50 self-start px-2 py-1 rounded-full mb-2">
                          {product.category.toUpperCase()}
                        </div>
                        <h3 className="text-gray-800 font-semibold text-lg mb-2 line-clamp-2">
                          {product.pname}
                        </h3>
                        <div className="mt-auto">
                          <div className="flex items-center justify-between">
                            <span className="text-green-600 font-bold text-xl">
                              ₹{product.price.toLocaleString()}
                            </span>
                            <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-1 px-3 rounded-full transition-colors duration-300">
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-sm">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p className="text-gray-600 text-lg mt-4">No products match your search</p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setMinPrice(0);
                    setMaxPrice(10000);
                  }}
                  className="mt-4 text-blue-500 hover:text-blue-700 font-medium"
                  >
                  Reset filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
      <Footer />
        </>
  );
};

export default Home;