import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import route from "../route";
import axios from "axios";
import { FiMinus, FiPlus, FiShoppingBag, FiMapPin, FiCreditCard, FiTrash2, FiAlertCircle, FiCheck, FiPackage, FiTruck } from "react-icons/fi";
import { toast } from "react-toastify";

const SCart = ({ setUsername, setRole, setLoggedIn }) => {
  const navigate = useNavigate();
  const { pid } = useParams();
  const value = localStorage.getItem("Auth");
  const [cartItem, setCartItem] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [priceTotal, setPriceTotal] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [removeTimer, setRemoveTimer] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [productStock, setProductStock] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    getCart();
  }, []);

  // Effect to handle auto-removal when quantity < 1
  useEffect(() => {
    if (quantity < 1 && cartItem) {
      if (!removeTimer) {
        // Start 10 second countdown for removal
        let secondsLeft = 10;
        setCountdown(secondsLeft);

        const timer = setInterval(() => {
          secondsLeft -= 1;
          setCountdown(secondsLeft);

          if (secondsLeft <= 0) {
            clearInterval(timer);
            handleRemoveCart();
          }
        }, 1000);

        setRemoveTimer(timer);
        toast.warning("Item will be removed in 10 seconds. Increase quantity to keep it in cart.");
      }
    } else if (removeTimer && quantity >= 1) {
      // Cancel removal if quantity increases
      clearInterval(removeTimer);
      setRemoveTimer(null);
      setCountdown(0);
    }

    return () => {
      if (removeTimer) clearInterval(removeTimer);
    };
  }, [quantity, cartItem]);

  const getCart = async () => {
    try {
      setIsLoading(true);
      const { status, data } = await axios.get(`${route()}getsinglecart/${pid}`, {
        headers: { Authorization: `Bearer ${value}` },
      });
      if (status === 200) {
        setUsername(data.username);
        setRole(data.role);
        setLoggedIn(true);
        setCartItem(data.cart);
        setQuantity(data.cart.quantity);
        setPriceTotal(data.cart.product.price * data.cart.quantity);
        setAddresses(data.addresses.addresses);
        setProductStock(data.cart.product.sizeQuantities[data.cart.size] || 0);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Could not fetch cart details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = async (id, type) => {
    try {
      // Check stock limits before sending request
      if (type === "increase" && quantity >= productStock) {
        toast.error(`Sorry, only ${productStock} items available in stock`);
        return;
      }

      const { status } = await axios.post(
        `${route()}editquantity`,
        { id, quantity, type },
        { headers: { Authorization: `Bearer ${value}` } }
      );
      if (status === 201) {
        getCart();
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    }
  };

  const handleRemoveCart = async () => {
    navigate(-1);
  };

  const handleCart = async () => {
    if (!selectedAddress) {
      toast.warning("Please select a delivery address");
      return;
    }

    if (quantity > productStock) {
      toast.error(`Cannot place order. Only ${productStock} items available in stock.`);
      return;
    }

    try {
      setIsProcessing(true);
      const { status, data } = await axios.post(
        `${route()}buynow`,
        { id: pid, addressId: selectedAddress },
        { headers: { Authorization: `Bearer ${value}` } }
      );
      if (status === 201 && data.msg === "success") {
        toast.success("Order placed successfully!");
        navigate("/home");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order");
    } finally {
      setIsProcessing(false);
    }
  };

  // Calculate final price
  const discountRate = 0.2; // 20% discount
  const deliveryCharge = 50;
  const discountAmount = priceTotal * discountRate;
  const finalPrice = priceTotal - discountAmount + deliveryCharge;

  // Estimated delivery date (5 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);
  const formattedDeliveryDate = deliveryDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-teal-600 text-xl">Loading your cart...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 md:px-8 py-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-teal-800 text-center mb-8">
          <FiShoppingBag className="inline-block mr-2 mb-1" />
          Checkout
        </h2>

        {!cartItem ? (
          <div className="text-center bg-white shadow-md rounded-lg p-10 mt-10">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">No product found in your cart</h2>
            <Link
              to="/home"
              className="inline-block px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Product Details Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-4 md:p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800">Product Details</h3>

                  {/* Remove button */}
                  <button
                    onClick={handleRemoveCart}
                    disabled={isProcessing}
                    className="flex items-center text-red-500 hover:text-red-700 transition-colors"
                  >
                    <span className="hidden sm:inline">Back</span>
                  </button>
                </div>

                {/* Auto-removal countdown notification */}
                {countdown > 0 && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex items-center">
                      <FiAlertCircle className="text-yellow-600 mr-2" />
                      <div className="flex-1">
                        <p className="text-sm text-yellow-700">
                          Quantity is 0. Item will be removed in <strong>{countdown}</strong> seconds.
                          Increase quantity to keep this item.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <div className="w-full lg:hidden p-4 border-b">
                    {/* Mobile Product View */}
                    <div className="flex items-start space-x-4">
                      <Link to={`/product/${cartItem.product._id}`}>
                        <img
                          src={cartItem.product.pimages[0]}
                          alt={cartItem.product.pname}
                          className="w-24 h-24 object-cover rounded-md shadow-sm"
                        />
                      </Link>
                      <div className="flex-1">
                        <Link to={`/product/${cartItem.product._id}`} className="text-lg font-medium text-gray-800 hover:text-teal-600">
                          {cartItem.product.pname}
                        </Link>

                        {/* Size Information */}
                        {cartItem.size && (
                          <p className="text-sm text-gray-600 mt-1">
                            Size: <span className="font-medium">{cartItem.size}</span>
                          </p>
                        )}

                        <p className="text-lg text-gray-700 mt-1">₹{cartItem.product.price}</p>

                        {/* Stock information */}
                        <p className="text-sm mt-1">
                          {productStock > 0 ? (
                            <span className="text-green-600 flex items-center">
                              <FiCheck className="mr-1" /> In Stock ({productStock} available)
                            </span>
                          ) : (
                            <span className="text-red-600 flex items-center">
                              <FiAlertCircle className="mr-1" /> Out of Stock
                            </span>
                          )}
                        </p>

                        <div className="flex items-center mt-3">
                          <button
                            className="p-1.5 bg-gray-200 hover:bg-gray-300 rounded-full text-gray-700 disabled:opacity-50"
                            onClick={() => handleQuantityChange(cartItem._id, "decrease")}
                            disabled={isProcessing}
                          >
                            <FiMinus size={16} />
                          </button>
                          <span className="px-4 py-1 mx-2 border bg-gray-50 rounded text-center min-w-[40px]">
                            {quantity}
                          </span>
                          <button
                            className="p-1.5 bg-gray-200 hover:bg-gray-300 rounded-full text-gray-700 disabled:opacity-50"
                            onClick={() => handleQuantityChange(cartItem._id, "increase")}
                            disabled={quantity >= productStock || isProcessing}
                          >
                            <FiPlus size={16} />
                          </button>
                        </div>

                        <p className="text-green-600 font-medium mt-3">
                          Total: ₹{cartItem.product.price * quantity}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Table View */}
                  <table className="hidden lg:table w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Product</th>
                        <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Details</th>
                        <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Price</th>
                        <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Quantity</th>
                        <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-gray-100">
                        <td className="py-4 px-6">
                          <Link to={`/product/${cartItem.product._id}`}>
                            <img
                              src={cartItem.product.pimages[0]}
                              alt={cartItem.product.pname}
                              className="w-24 h-24 object-cover rounded-md shadow-sm"
                            />
                          </Link>
                        </td>
                        <td className="py-4 px-6">
                          <Link to={`/product/${cartItem.product._id}`} className="font-medium text-gray-800 hover:text-teal-600">
                            {cartItem.product.pname}
                          </Link>

                          {/* Size Information */}
                          {cartItem.size && (
                            <p className="text-sm text-gray-600 mt-1">
                              Size: <span className="font-medium">{cartItem.size}</span>
                            </p>
                          )}

                          {/* Stock information */}
                          <p className="text-sm mt-2">
                            {productStock > 0 ? (
                              <span className="text-green-600 flex items-center">
                                <FiCheck className="mr-1" /> In Stock ({productStock} available)
                              </span>
                            ) : (
                              <span className="text-red-600 flex items-center">
                                <FiAlertCircle className="mr-1" /> Out of Stock
                              </span>
                            )}
                          </p>
                        </td>
                        <td className="py-4 px-6 text-gray-800">₹{cartItem.product.price}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <button
                              className="p-1.5 bg-gray-200 hover:bg-gray-300 rounded-full text-gray-700 disabled:opacity-50"
                              onClick={() => handleQuantityChange(cartItem._id, "decrease")}
                              disabled={isProcessing}
                            >
                              <FiMinus size={16} />
                            </button>
                            <span className="px-4 py-1 border bg-gray-50 rounded text-center min-w-[40px]">
                              {quantity}
                            </span>
                            <button
                              className="p-1.5 bg-gray-200 hover:bg-gray-300 rounded-full text-gray-700 disabled:opacity-50"
                              onClick={() => handleQuantityChange(cartItem._id, "increase")}
                              disabled={quantity >= productStock || isProcessing}
                            >
                              <FiPlus size={16} />
                            </button>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-green-600 font-medium">₹{cartItem.product.price * quantity}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Address Selection */}
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-4 md:p-6 border-b border-gray-100">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800 flex items-center">
                    <FiMapPin className="mr-2" /> Delivery Address
                  </h3>
                </div>
                <div className="p-4 md:p-6">
                  {addresses.length > 0 ? (
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
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-600 mb-4">No delivery addresses found</p>
                      <Link
                        to="/profile"
                        className="inline-block px-4 py-2 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700 transition-colors"
                      >
                        Add New Address
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            

            {/* Shipping Information */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-4 md:p-6 border-b border-gray-100">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 flex items-center">
                  <FiTruck className="mr-2" />
                  Shipping Information
                </h3>
              </div>
              <div className="p-4 md:p-6">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 mr-4">
                    <FiPackage />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Standard Delivery</p>
                    <p className="text-gray-600">Estimated delivery by {formattedDeliveryDate}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="h-10 w-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 mr-4">
                    <FiTruck />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Shipping Fee</p>
                    <p className="text-gray-600">₹{deliveryCharge}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

            {/* Order Summary Section */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow-md rounded-lg sticky top-6">
            <div className="p-4 md:p-6 border-b border-gray-100">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800">Order Summary</h3>
            </div>
            <div className="p-4 md:p-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <p className="text-gray-600">Subtotal ({quantity} items)</p>
                  <p className="text-gray-800 font-medium">₹{priceTotal}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Discount (20%)</p>
                  <p className="text-green-600 font-medium">-₹{discountAmount.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Delivery Charge</p>
                  <p className="text-gray-800 font-medium">₹{deliveryCharge}</p>
                </div>
                <div className="border-t border-gray-100 pt-3 mt-3">
                  <div className="flex justify-between">
                    <p className="text-gray-800 font-semibold">Total</p>
                    <p className="text-gray-800 font-bold">₹{finalPrice.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleCart}
                  disabled={isProcessing || !selectedAddress || quantity <= 0 || quantity > productStock}
                  className={`w-full py-3 px-4 rounded-lg flex items-center justify-center font-medium text-white transition-colors ${isProcessing || !selectedAddress || quantity <= 0 || quantity > productStock
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-teal-600 hover:bg-teal-700"
                    }`}
                >
                  {isProcessing ? (
                    <>
                      <span className="mr-2">Processing...</span>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </>
                  ) : (
                    <>
                      <FiCreditCard className="mr-2" />
                      Place Order
                    </>
                  )}
                </button>
              </div>

              <div className="mt-6 text-center">
                <Link
                  to="/home"
                  className="text-teal-600 hover:text-teal-800 font-medium"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
        )}
    </div>
    </div >
  );
};

export default SCart;