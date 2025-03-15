import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import route from '../route';
import axios from 'axios';
import { FiMinus, FiPlus, FiTrash2, FiAlertCircle, FiChevronLeft } from 'react-icons/fi';
import { FaTruck, FaShoppingBag, FaCreditCard, FaShieldAlt, FaMoneyBillWave, FaClock } from 'react-icons/fa';

const Cart = ({ setUsername, setRole, setLoggedIn }) => {
  const navigate = useNavigate();
  const value = localStorage.getItem('Auth');
  const [cartItems, setCartItems] = useState([]);
  const [quantities, setQuantities] = useState([]);
  const [priceTotal, setPriceTotal] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [stockErrors, setStockErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Calculate estimated delivery date (5 days from now)
  useEffect(() => {
    const today = new Date();
    const delivery = new Date(today);
    delivery.setDate(today.getDate() + 5);
    setEstimatedDelivery(delivery.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    }));
  }, []);

  // Fetch cart data on component mount
  useEffect(() => {
    getCart();
  }, []);

  const getCart = async () => {
    setIsLoading(true);
    try {
      const { status, data } = await axios.get(`${route()}getcart`, {
        headers: { "Authorization": `Bearer ${value}` }
      });

      if (status === 200) {
        setUsername(data.username);
        setRole(data.role);
        setLoggedIn(true);
        setCartItems(data.cart);
        setQuantities(data.cart.map(item => item.quantity));
        setPriceTotal(data.cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0));
        setAddresses(data.addresses.addresses);
        console.log(data.addresses);
        

        // Check stock for each item
        const errors = {};
        data.cart.forEach((item) => {
          const selectedSize = item.size;
          if (item.product.sizeQuantities &&
            item.product.sizeQuantities[selectedSize] < item.quantity) {
            errors[item._id] = `Only ${item.product.sizeQuantities[selectedSize]} items in stock for size ${selectedSize}`;
          }
        });
        setStockErrors(errors);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = async (id) => {
    try {      
      const { status } = await axios.delete(
        `${route()}removefromcart`,
        {
          data:{id},
          headers: { "Authorization": `Bearer ${value}` }
        } 
      );

      
    if (status === 201) {
      // Remove from local state
      const newItems = cartItems.filter(item => item._id !== id);
      setCartItems(newItems);
      
      // Update quantities and price total
      const newQuantities = quantities.filter((_, index) => cartItems[index]._id !== id);
      setQuantities(newQuantities);
      
      // Recalculate total price with proper quantity mapping
      const newTotal = newItems.reduce((acc, item, idx) => 
        acc + (item.product.price * newQuantities[idx]), 0);
      setPriceTotal(newTotal);
      
      // Remove from stockErrors if present
      if (stockErrors[id]) {
        const newErrors = { ...stockErrors };
        delete newErrors[id];
        setStockErrors(newErrors);
      }
      
      toast.success("Item removed from cart!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  } catch (error) {
    console.error("Error removing item from cart:", error);
    toast.error("Failed to remove item from cart");
  }
};

  const handleQuantityChange = async (index, id, type) => {
    // Check stock before increasing quantity
    if (type === 'increase') {
      const item = cartItems[index];
      const selectedSize = item.size;
      const currentStock = item.product.sizeQuantities[selectedSize];

      if (quantities[index] + 1 > currentStock) {
        setStockErrors({
          ...stockErrors,
          [id]: `Only ${currentStock} items in stock for size ${selectedSize}`
        });
        return;
      } else {
        // Clear error if it exists
        if (stockErrors[id]) {
          const newErrors = { ...stockErrors };
          delete newErrors[id];
          setStockErrors(newErrors);
        }
      }
    }

    try {
      const { status } = await axios.post(
        `${route()}editquantity`,
        { id, quantity: quantities[index], type },
        { headers: { "Authorization": `Bearer ${value}` } }
      );

      if (status === 201) {
        getCart();
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleCouponApply = () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    // Simulate coupon check - in a real app this would be an API call
    if (couponCode.toUpperCase() === "DISCOUNT20") {
      setCouponError("");
      // Coupon logic would go here
      alert("Coupon applied successfully!");
    } else {
      setCouponError("Invalid coupon code");
    }
  };

  const handleCart = async () => {
    // Check if there are any stock errors
    // if (Object.keys(stockErrors).length > 0) {
    //   alert("Please resolve stock issues before placing your order.");
    //   return;
    // }

    if (!selectedAddress) {
      alert("Please select an address.");
      return;
    }

    setIsPlacingOrder(true);
    try {
      const { status, data } = await axios.post(
        `${route()}placeorder`,
        { selectedAddress, orderNotes, paymentMethod },
        { headers: { "Authorization": `Bearer ${value}` } }
      );

      if (status === 201) {
        alert(data.msg);
        if (data.msg1 === "success") {
          navigate('/home');
        }
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("An error occurred while placing the order. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const discountPercentage = 20;
  const deliveryCharge = priceTotal > 500 ? 0 : 50;
  const discountAmount = priceTotal * (discountPercentage / 100);
  const totalAfterDiscount = priceTotal - discountAmount + deliveryCharge;

  return (
    <div className="w-full min-h-screen bg-gray-100 py-4">
      {/* Header with Flipkart-style blue bar */}
      <div className="bg-blue-600 text-white py-3 mb-4 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link to="/home" className="flex items-center">
              <span className="font-bold text-xl italic">Flipstyle</span>
              <span className="text-yellow-300 ml-1 italic text-sm">Cart</span>
            </Link>
            <div className="text-sm">
              Secure Checkout <FaShieldAlt className="inline ml-1" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaShoppingBag className="text-gray-400 w-12 h-12" />
            </div>
            <h2 className="text-2xl font-medium mb-3 text-gray-800">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added any products to your cart yet.</p>
            <Link to="/home" className="bg-blue-600 text-white font-medium py-3 px-8 rounded hover:bg-blue-700 transition duration-300">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column: Cart Items + Addresses */}
            <div className="lg:w-8/12 w-full">
              {/* Back to Shopping Link */}
              <div className="mb-4">
                <Link to="/home" className="flex items-center text-blue-600 hover:text-blue-800 transition text-sm">
                  <FiChevronLeft size={16} />
                  <span className="ml-1">Continue Shopping</span>
                </Link>
              </div>

              {/* Cart Items Card */}
              <div className="bg-white rounded-sm shadow-sm p-4 md:p-6 mb-6">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
                  <h2 className="text-lg font-medium text-gray-800">Shopping Cart ({cartItems.length})</h2>
                  <span className="text-blue-600 text-sm font-medium">Items are reserved for 60 minutes</span>
                </div>

                {cartItems.map((item, index) => (
                  <div key={index} className="border-b border-gray-100 py-4 last:border-b-0">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Product Image */}
                      <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded overflow-hidden">
                        <Link to={`/product/${item.product._id}`}>
                          <img
                            src={item.product.pimages[0]}
                            alt={item.product.pname}
                            className="w-full h-full object-contain"
                          />
                        </Link>
                      </div>

                      {/* Product Details */}
                      <div className="flex-grow">
                        <div className="flex flex-col h-full justify-between">
                          <div>
                            <Link to={`/product/${item.product._id}`} className="hover:text-blue-600 transition">
                              <h3 className="text-base font-medium text-gray-800 line-clamp-2">{item.product.pname}</h3>
                            </Link>
                            
                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mt-1">
                              <span>Size: <span className="font-medium text-gray-700">{item.size}</span></span>
                              <span className="text-gray-300">|</span>
                              <span>Seller: <span className="font-medium text-gray-700">RetailNet</span></span>
                            </div>
                            
                            {/* Price section with original price strikethrough */}
                            <div className="mt-2 flex items-center">
                              <span className="text-lg font-medium text-gray-800">₹{item.product.price.toFixed(2)}</span>
                              <span className="text-gray-500 line-through text-sm ml-2">
                                ₹{(item.product.price * 1.2).toFixed(2)}
                              </span>
                              <span className="text-green-600 text-xs font-medium ml-2">20% off</span>
                            </div>
                            
                            {/* Delivery information */}
                            <div className="mt-1 text-xs text-gray-600">
                              <span className="font-medium text-green-600">Free delivery</span> by {estimatedDelivery}
                            </div>
                          </div>

                          {/* Bottom row with quantity controls and actions */}
                          <div className="mt-3 flex flex-wrap gap-4 items-center">
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-gray-300 rounded">
                              <button
                                onClick={() => handleQuantityChange(index, item._id, 'decrease')}
                                disabled={quantities[index] <= 1}
                                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Decrease quantity"
                              >
                                <FiMinus size={14} />
                              </button>
                              <input
                                type="text"
                                className="w-10 text-center font-medium text-gray-800 border-x border-gray-300 h-8"
                                value={quantities[index]}
                                readOnly
                              />
                              <button
                                onClick={() => handleQuantityChange(index, item._id, 'increase')}
                                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                                aria-label="Increase quantity"
                              >
                                <FiPlus size={14} />
                              </button>
                            </div>

                            {/* Action buttons */}
                            <button
                              onClick={() => handleRemoveItem(item._id)}
                              className="text-red-600 hover:text-gray-800 font-medium text-sm"
                            >
                              REMOVE
                            </button>
                            
                            
                          </div>
                          </div>
                      </div>
                    </div>
                    
                    {/* Stock error message */}
                    {stockErrors[item._id] && (
                      <div className="mt-2 text-red-500 flex items-center text-xs">
                        <FiAlertCircle className="mr-1" />
                        {stockErrors[item._id]}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Addresses Section */}
              <div className="bg-white rounded-sm shadow-sm p-4 md:p-6">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Select Delivery Address</h2>
                
                {addresses.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500 mb-3">No saved addresses found</p>
                    <Link to="/profile" className="bg-blue-600 text-white px-4 py-2 rounded text-sm">
                      Add New Address
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                      <select
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                        value={selectedAddress}
                        onChange={(e) => setSelectedAddress(e.target.value)}
                      >
                        <option value="">Select delivery address</option>
                        {addresses.map((address, index) => (
                          <option key={index} value={address._id}>
                            {address.houseName}, {address.place}, {address.postOffice} - {address.pincode}
                          </option>
                        ))}
                      </select>
                      {!selectedAddress && (
                        <p className="text-sm text-gray-500">Please select a delivery address to continue</p>
                      )}
                    </div>
                )}

                {/* Order Notes */}
                <div className="mt-4">
                  <label htmlFor="orderNotes" className="text-sm font-medium text-gray-700 block mb-2">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    id="orderNotes"
                    rows="3"
                    className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add any special instructions or notes for delivery"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:w-4/12 w-full">
              {/* Order Summary Card */}
              <div className="bg-white rounded-sm shadow-sm p-4 md:p-6 sticky top-4">
                <h2 className="text-lg font-medium text-gray-800 border-b border-gray-100 pb-4 mb-4">Order Summary</h2>
                
                {/* Price details */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Price ({cartItems.length} items)</span>
                    <span>₹{priceTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Discount</span>
                    <span className="text-green-600">-₹{discountAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Charges</span>
                    {deliveryCharge === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      <span>₹{deliveryCharge.toFixed(2)}</span>
                    )}
                  </div>
                  <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between font-medium text-lg">
                    <span>Total Amount</span>
                    <span>₹{totalAfterDiscount.toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Coupon Section */}
                <div className="border-t border-gray-100 pt-4 mb-4">
                  <h3 className="text-sm font-medium text-gray-800 mb-2">Apply Coupon</h3>
                  <div className="flex">
                    <input
                      type="text"
                      className="flex-grow border border-gray-300 rounded-l px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button
                      onClick={handleCouponApply}
                      className="bg-blue-600 text-white px-4 py-2 rounded-r text-sm font-medium hover:bg-blue-700 transition"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-red-500 text-xs mt-1">{couponError}</p>
                  )}
                </div>
                
                {/* Payment Methods */}
                <div className="border-t border-gray-100 pt-4 mb-4">
                  <h3 className="text-sm font-medium text-gray-800 mb-3">Payment Method</h3>
                  <div className="space-y-2">
                    <div 
                      className={`flex items-center border rounded-sm p-3 cursor-pointer ${paymentMethod === 'cod' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                      onClick={() => setPaymentMethod('cod')}
                    >
                      <div className="h-4 w-4 flex-shrink-0 mr-2">
                        <div className={`h-4 w-4 rounded-full border-2 ${paymentMethod === 'cod' ? 'border-blue-500' : 'border-gray-300'}`}>
                          {paymentMethod === 'cod' && (
                            <div className="h-2 w-2 rounded-full bg-blue-500 m-0.5"></div>
                          )}
                        </div>
                      </div>
                      <div className="flex-grow flex items-center">
                        <FaMoneyBillWave className="text-green-600 mr-2" />
                        <span>Cash on Delivery</span>
                      </div>
                    </div>
                    
                    <div 
                      className={`flex items-center border rounded-sm p-3 cursor-pointer ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <div className="h-4 w-4 flex-shrink-0 mr-2">
                        <div className={`h-4 w-4 rounded-full border-2 ${paymentMethod === 'card' ? 'border-blue-500' : 'border-gray-300'}`}>
                          {paymentMethod === 'card' && (
                            <div className="h-2 w-2 rounded-full bg-blue-500 m-0.5"></div>
                          )}
                        </div>
                      </div>
                      <div className="flex-grow flex items-center">
                        <FaCreditCard className="text-blue-600 mr-2" />
                        <span>Card Payment</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Delivery info */}
                <div className="mb-4 flex items-center text-sm text-gray-600">
                  <FaTruck className="text-blue-600 mr-2" />
                  <span>Delivery by {estimatedDelivery}</span>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={handleCart}
                  disabled={cartItems.length === 0  || !selectedAddress || isPlacingOrder}
                  className="w-full bg-blue-600 text-white py-3 rounded font-medium hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center"
                >
                  {isPlacingOrder ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    'PLACE ORDER'
                  )}
                </button>
                
                {/* Safety note */}
                <div className="mt-4 text-xs text-gray-500 flex items-center">
                  <FaShieldAlt className="mr-2 text-green-600" />
                  <span>Safe and Secure Payments. 100% Authentic products.</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;