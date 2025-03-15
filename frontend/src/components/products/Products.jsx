import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import route from '../route';
import { Link, useParams } from 'react-router-dom';
import { FaEdit, FaTrashAlt, FaBan } from 'react-icons/fa';

const Products = ({ setUsername, setRole, setLoggedIn }) => {
  const { category } = useParams();
  const value = localStorage.getItem("Auth");
  const [products, setProducts] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [productId, setProductId] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [category]);
  
  const fetchProducts = async () => {
    try {
      const { status, data } = await axios.get(
        `${route()}products/${category}`,
        { headers: { "Authorization": `Bearer ${value}` } }
      );
      if (status) {
        setUsername(data.username);
        setRole(data.role);
        setLoggedIn(true);
        setProducts(data.products);
        
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleDelete = async (productId) => {
    setIsDeleting(true);
    try {
      const { status } = await axios.delete(
        `${route()}deleteproduct/${productId}`,
        { headers: { "Authorization": `Bearer ${value}` } }
      );
      if (status===200) {
        // Remove the deleted product from state
        setProducts(products.filter(product => product._id !== productId));
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBlockProduct = async (productId, isCurrentlyBlocked) => {
    try {      
      const { status } = await axios.put(
        `${route()}blockproduct/${productId}`,
        { blocked: !isCurrentlyBlocked },
        { headers: { "Authorization": `Bearer ${value}` } }
      );
      if (status) {
        // Update product status in state
        setProducts(products.map(product => 
          product._id === productId 
            ? { ...product, blocked: !isCurrentlyBlocked } 
            : product
        ));
        fetchProducts();
      }
    } catch (error) {
      console.error('Error updating product status:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        {category ? category.charAt(0).toUpperCase() + category.slice(1) : 'All'} Products
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {products && products.length > 0 ? (
          products.map((product) => (
            <div 
              key={product._id} 
              className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${product.blocked ? 'opacity-60' : ''}`}
            >
              <div className="relative">
                {product.pimages && product.pimages.length > 0 ? (
                  <img 
                    src={product.pimages[0]} 
                    alt={product.pname} 
                    className="w-full h-64 object-cover"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">No image available</p>
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full shadow-md">
                  <span className="text-xs font-semibold text-gray-700 uppercase">
                    {product.category}
                  </span>
                </div>
                {product.isBlocked && (
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                    <div className="bg-red-500 text-white px-4 py-2 rounded-md font-bold">
                      BLOCKED
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-5">
                <h2 className="text-xl font-bold text-gray-800 mb-2 capitalize">
                  {product.pname}
                </h2>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">{product.brand}</span>
                  <span className="text-xl font-bold text-indigo-600">₹{product.price.toFixed(2)}</span>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Available Sizes:</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(product.sizeQuantities).map((size) => (
                      <div 
                        key={size} 
                        className={`px-3 py-1 rounded-md text-sm font-medium ${
                          product.sizeQuantities[size] > 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {size}: {product.sizeQuantities[size]}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-2 mt-4">
                  <Link 
                    to={`/editproduct/${product._id}`}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-center font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                  >
                    <FaEdit className="text-lg" />
                    Edit
                  </Link>
                  
                  <button 
                    onClick={() => handleBlockProduct(product._id, product.isBlocked)}
                    className={`flex-1 py-2 px-4 rounded-lg text-center font-medium flex items-center justify-center gap-2 transition-colors ${
                      product.isBlocked 
                        ? 'bg-gray-600 text-white hover:bg-gray-700' 
                        : 'bg-yellow-600 text-white hover:bg-yellow-700'
                    }`}
                  >
                    <FaBan className="text-lg" />
                    {product.isBlocked ? 'Unblock' : 'Block'}
                  </button>
                  
                  <button 
                    onClick={() => {setIsDeleting(true); setProductId(product._id)}}
                    disabled={isDeleting}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg text-center font-medium flex items-center justify-center gap-2 hover:bg-red-700 transition-colors disabled:bg-red-300"
                  >
                    <FaTrashAlt className="text-lg" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center py-16 text-gray-500">
            <div className="text-center">
              <p className="text-2xl font-medium mb-2">No products available</p>
              <p>Try selecting a different category or adding new products</p>
            </div>
          </div>
        )}
        
      </div>
      {isDeleting && (
  <div
    className={`fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 delete-modal ${
      isDeleting ? 'show' : ''
    }`}
  >
    <div
      // ref={modalRef}
      className={`bg-white p-6 rounded-lg shadow-xl w-full max-w-md delete-confirmation-container ${
        isDeleting ? 'show' : ''
      }`}
      style={{
        transform: isDeleting ? 'scale(1)' : 'scale(0.9)',
        opacity: isDeleting ? 1 : 0,
        transition: 'all 0.3s ease'
      }}
    >
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <FaTrashAlt className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Product</h3>
        <p className="text-sm text-gray-500">
          Are you sure you want to delete this product? This action cannot be undone.
        </p>
      </div>
      <div className="mt-6 flex justify-center space-x-4">
        <button
          type="button"
          onClick={() => setIsDeleting(false)}
          className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base cursor-pointer 
          font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => handleDelete(productId)}
          className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base cursor-pointer
          font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}

      
    </div>
  );
};

export default Products;