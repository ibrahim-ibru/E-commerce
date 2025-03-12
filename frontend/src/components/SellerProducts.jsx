// src/pages/SellerProducts.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const SellerProducts = () => {
  const [sellerData, setSellerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { sellerId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }

    const fetchSellerProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3005/api/admin/seller/products/${sellerId}`,
          { headers: { Authorization: `Bearer ${adminToken}` } }
        );
        setSellerData(response.data);
      } catch (error) {
        console.error('Error fetching seller products:', error);
        if (error.response?.status === 403) {
          localStorage.removeItem('adminToken');
          navigate('/admin/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSellerProducts();
  }, [sellerId, navigate]);

  const handleBack = () => {
    navigate('/admin/dashboard');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold">Seller Products</h1>
            <button
              onClick={handleBack}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Seller Info */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Seller Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Seller Name</p>
              <p className="font-medium">{sellerData.sellerName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Company</p>
              <p className="font-medium">{sellerData.company?.name || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium">{sellerData.company?.location || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Contact</p>
              <p className="font-medium">{sellerData.company?.contact || 'Not provided'}</p>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium">Products ({sellerData.products.length})</h2>
          </div>
          
          {sellerData.products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {sellerData.products.map((product) => (
                <div key={product._id} className="border rounded-lg overflow-hidden shadow-sm">
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    {product.pimages && product.pimages.length > 0 ? (
                      <img 
                        src={product.pimages[0]} 
                        alt={product.pname} 
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="text-gray-400">No image</div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{product.pname}</h3>
                    <p className="text-gray-600 text-sm mb-2">Brand: {product.brand}</p>
                    <p className="text-gray-800 font-bold mb-2">₹{product.price}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-gray-100 rounded px-2 py-1">
                        {product.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {Object.values(product.sizeQuantities || {}).reduce((a, b) => a + b, 0)} in stock
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              This seller has no products.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerProducts;
