import React, { useState, useEffect } from 'react';
import axios from 'axios';
import route from '../route';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaRegHeart, FaTag } from 'react-icons/fa';

const DProd = ({ setUsername, setRole, setLoggedIn }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const value = localStorage.getItem('Auth');
  const [product, setProduct] = useState({});
  const [isOnCart, setIsOnCart] = useState(false);
  const [isOnWishlist, setIsOnWishlist] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [cart, setCart] = useState({
    product: {},
    size: "",
    quantity: 0
  });
  const [stock, setStock] = useState(0);
  const [mainImage, setMainImage] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [id, value, setUsername, setRole, setLoggedIn]);

  const fetchProduct = async () => {
    if (!id) return;
    try {
      const { status, data } = await axios.get(`${route()}product/${id}`, {
        headers: { Authorization: `Bearer ${value}` },
      });

      if (status === 200) {
        setUsername(data.username);
        setRole(data.role);
        setLoggedIn(true);
        setProduct(data.product);
        if (data.product.pimages && data.product.pimages.length > 0) {
          setMainImage(data.product.pimages[0]);
        }
        setIsOnCart(data.isOnCart);
        setIsOnWishlist(data.isOnWishlist);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const handleSize = (size) => {
    setSelectedSize(size);
    setStock(product.sizeQuantities[size]);
    setCart({ size: size, product: product, quantity: 1 });
  };

  const handleAddToCart = async () => {
    if (cart.size) {
      const { status, data } = await axios.post(`${route()}addtocart`, cart, {
        headers: { "Authorization": `Bearer ${value}` }
      });
      if (status === 201) {
        alert(data.msg);
        fetchProduct();
      } else {
        alert("Adding incomplete");
      }
    } else {
      alert("Please select size");
    }
  };

  const toggleWishlist = async () => {
    if (isOnWishlist) {
      const { status } = await axios.delete(`${route()}removefromwishlist`, {
        data: { id: product._id },
        headers: { "Authorization": `Bearer ${value}` }
      });
      if (status === 201) {
        fetchProduct();
      }
    } else {
      const { status } = await axios.post(`${route()}addtowishlist`, { id: product._id }, {
        headers: { "Authorization": `Bearer ${value}` }
      });
      if (status === 201) {
        fetchProduct();
      }
    }
  };

  const handleBuynow = async () => {
    if (cart.size) {
      const { status } = await axios.post(`${route()}addtocart`, cart, {
        headers: { "Authorization": `Bearer ${value}` }
      });
      if (status === 201) {
        navigate(`/scart/${product._id}`);
      } else {
        alert("Could not add to cart");
      }
    } else {
      alert("Please select size");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all hover:shadow-xl hover:-translate-y-1 lg:flex">
          {/* Product Images Section */}
          <div className="w-full lg:w-3/5 bg-gray-50 p-6 lg:p-8">
            <div className="space-y-6">
              {/* Main Image */}
              <div className="relative overflow-hidden rounded-xl shadow-md transition-transform duration-300 hover:scale-105">
                <img
                  src={mainImage || (product.pimages && product.pimages[0])}
                  alt="Main Product"
                  className="w-full h-96 object-contain bg-white rounded-xl p-4"
                />
              </div>
              
              {/* Thumbnails */}
              {product.pimages && product.pimages.length > 0 && (
                <div className="flex flex-wrap justify-center gap-3 mt-6">
                  {product.pimages.map((image, index) => (
                    <div
                      key={index}
                      className={`w-20 h-20 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 border-2 ${
                        mainImage === image ? 'border-blue-500 shadow-lg scale-105' : 'border-transparent'
                      } hover:shadow-md hover:scale-105`}
                      onClick={() => setMainImage(image)}
                    >
                      <img
                        src={image}
                        alt={`Product Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Details Section */}
          <div className="w-full lg:w-2/5 p-6 lg:p-8">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-800 leading-tight">{product.pname}</h1>
              <button
                onClick={toggleWishlist}
                className="text-2xl focus:outline-none transition-transform duration-300 hover:scale-110"
                aria-label={isOnWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                {isOnWishlist ? (
                  <FaHeart className="text-red-500" />
                ) : (
                  <FaRegHeart className="text-gray-400 hover:text-red-500" />
                )}
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {product.category?.toUpperCase()}
                </span>
                <span className="text-gray-500 text-sm">Brand: <span className="font-medium">{product.brand}</span></span>
              </div>

              <div className="flex items-baseline mt-2">
                <span className="text-2xl font-bold text-gray-900">₹{product.price?.toFixed(2)}</span>
                <span className="ml-2 text-sm text-gray-500 line-through">₹{(product.price * 1.2)?.toFixed(2)}</span>
                <span className="ml-2 text-sm text-green-600 font-medium">20% off</span>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <div className="flex items-center space-x-2">
                  <FaTag className="text-green-500" />
                  <h3 className="text-green-700 font-medium">Available Offers</h3>
                </div>
                <ul className="mt-2 space-y-1 text-sm text-gray-600">
                  <li>• Bank Offer: Get 10% off up to ₹50 on first Shoppie UPI transaction</li>
                  <li>• Free delivery on orders above ₹499</li>
                  <li>• Special price: Get extra 5% off with app</li>
                </ul>
              </div>

              {/* Size Selection */}
              <div className="mt-6">
                <h3 className="text-base font-medium text-gray-700 mb-2">Select Size</h3>
                <div className="flex flex-wrap gap-3">
                  {product.sizeQuantities &&
                    Object.keys(product.sizeQuantities).map((size) => (
                      <button
                        key={size}
                        className={`px-4 py-2 rounded-md border text-sm font-medium transition-all duration-200 ${
                          selectedSize === size
                            ? 'bg-blue-600 text-white border-blue-600'
                            : product.sizeQuantities[size] <= 0
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                        }`}
                        onClick={() => handleSize(size)}
                        disabled={product.sizeQuantities[size] <= 0}
                      >
                        {size}
                      </button>
                    ))}
                </div>
                {selectedSize && (
                  <div className="mt-2 text-sm">
                    <span className={`inline-block px-3 py-1 rounded-full ${stock > 5 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {stock > 5 ? 'In Stock' : stock > 0 ? 'Low Stock' : 'Out of Stock'}: {stock} left
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                {isOnCart ? (
                  <Link to={`/scart/${product._id}`} className="w-full">
                    <button className="w-full bg-blue-800 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center">
                      Buy Now
                    </button>
                  </Link>
                ) : (
                  <button
                    onClick={handleBuynow}
                    className="w-full bg-blue-800 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
                  >
                    Buy Now
                  </button>
                )}

                {isOnCart ? (
                  <Link to="/cart" className="w-full">
                    <button className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center">
                      <FaShoppingCart className="mr-2" />
                      Go to Cart
                    </button>
                  </Link>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
                  >
                    <FaShoppingCart className="mr-2" />
                    Add to Cart
                  </button>
                )}
              </div>

              {/* Delivery and Services */}
              <div className="mt-6 border-t pt-4 border-gray-200">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="font-medium">Delivery:</span>
                  <span>Usually ships within 2-3 business days</span>
                </div>
                <div className="flex items-center space-x-2 mt-2 text-sm text-gray-600">
                  <span className="font-medium">Return Policy:</span>
                  <span>30 days easy returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DProd;