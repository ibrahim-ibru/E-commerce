import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import route from '../route';
import axios from 'axios';
import { FiMinus, FiPlus } from 'react-icons/fi';

const Cart = ({ setUsername, setRole, setLoggedIn }) => {
  const navigate = useNavigate();
  const value = localStorage.getItem('Auth');
  const [cartItems, setCartItems] = useState([]); // Holds cart items
  const [quantities, setQuantities] = useState([]); // Holds quantities of items
  const [priceTotal, setPriceTotal] = useState(0); // Holds the total price
  const [addresses, setAddresses] = useState([]);

  const [selectedAddress, setSelectedAddress] = useState("");

  // Fetch cart data from localStorage on component mount
  useEffect(() => {
    getCart();
  }, []);

  const getCart = async () => {
    const { status, data } = await axios.get(`${route()}getcart`, { headers: { "Authorization": `Bearer ${value}` } });
    if (status === 200) {
      setUsername(data.username);
      setRole(data.role);
      setLoggedIn(true);
      setCartItems(data.cart);
      setQuantities(data.cart.map(item => item.quantity));
      setPriceTotal(data.cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0));
      setAddresses(data.addresses.addresses);
    }
  }

  const handleRemove = (id) => {
    localStorage.removeItem(id);
    const newItems = cartItems.filter((item) => item.id !== id);
    setCartItems(newItems);
    updateTotal(newItems, quantities);
  };

  const handleQuantityChange = async (index, id, type) => {
    const { status, data } = await axios.post(
      `${route()}editquantity`,
      { id, quantity: quantities[index], type },
      { headers: { "Authorization": `Bearer ${value}` } }
    );
    if (status === 201) {
      getCart();
    }
  };

  const updateTotal = (items, qty) => {
    let totalAmount = 0;
    items.forEach((item, index) => {
      const cost = item.price - (item.price * item.discountPercentage) / 100;
      totalAmount += cost * qty[index];
    });
    setTotal(totalAmount + 50); // Add delivery charge
  };

  const handleCart = async () => {
    if (selectedAddress) {
      try {
        const { status, data } = await axios.post(
          `${route()}placeorder`,
          { selectedAddress },
          { headers: { "Authorization": `Bearer ${value}` } }
        );

        if (status === 201) {
          alert(data.msg);
          if (data.msg1 === "success") {
            navigate('/home');
          }
        } else {
          alert("Order placement failed. Please try again.");
        }
      } catch (error) {
        console.error("Error placing order:", error);
        alert("An error occurred while placing the order. Please try again.");
      }
    } else {
      alert("Please select an address.");
    }
  };

  return (
    <div className="w-full p-8 bg-gray-100">
      {cartItems.length === 0 ? (
        <div className="text-center mt-12">
          <h2 className="text-xl font-semibold mb-4">Cart empty..</h2>
          <Link to={'/home'} className="text-teal-700 font-bold text-lg hover:underline">Go to products</Link>
        </div>
      ) : (
        <div className="w-4/5 mx-auto flex justify-between">
          <div className="flex flex-col gap-14">
            {cartItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center bg-white rounded-lg hover:translate-y-[-5px] transition-transform relative">
                <table className="w-full border-collapse my-6 bg-gray-50 border-2 border-gray-800">
                  <thead className="text-gray-700 font-semibold text-lg border-b-2 border-gray-800">
                    <tr>
                      <th className="border-2 border-gray-800 p-4 text-center text-gray-700 text-lg">Product</th>
                      <th className="border-2 border-gray-800 p-4 text-center text-gray-700 text-lg">Title</th>
                      <th className="border-2 border-gray-800 p-4 text-center text-gray-700 text-lg">Price</th>
                      <th className="border-2 border-gray-800 p-4 text-center text-gray-700 text-lg">Quantity</th>
                      <th className="border-2 border-gray-800 p-4 text-center text-gray-700 text-lg">Total</th>
                    </tr>
                  </thead>
                  <tbody className="text-base text-gray-600 text-center">
                    <tr className="hover:bg-gray-100">
                      <td className="border-2 border-black text-blue-900 text-base p-5">
                        <div className="image">
                          <Link to={`/product/${item.product._id}`}>
                            <img
                              src={item.product.pimages[0]}
                              alt={item.product.pname}
                              title="View product"
                              className="w-20 h-20 object-cover object-top rounded-lg cursor-pointer transition-transform"
                            />
                          </Link>
                        </div>
                      </td>
                      <td className="border-2 border-black text-blue-900 text-base p-5">
                        <div>
                          <h4 className="text-lg font-bold text-gray-700">{item.product.pname}</h4>
                        </div>
                      </td>
                      <td className="border-2 border-black text-blue-900 text-base p-5">
                        <div className="ml-0 text-red-500">
                          <h3 className="text-xl font-medium">₹{item.product.price}</h3>
                        </div>
                      </td>
                      <td className="border-2 border-black text-blue-900 text-base p-5">
                        <div>
                          <div className="flex items-center gap-4 ml-0">
                            <span
                              className="flex justify-center items-center text-2xl cursor-pointer text-gray-700 select-none"
                              onClick={() => handleQuantityChange(index, item._id, 'decrease')}
                            >
                              <FiMinus size={24} />
                            </span>
                            <span className="p-1 border border-gray-300 rounded text-lg text-center w-12 bg-gray-100">
                              {quantities[index]}
                            </span>
                            <span
                              className="flex justify-center items-center text-2xl cursor-pointer text-gray-700 select-none"
                              onClick={() => handleQuantityChange(index, item._id, 'increase')}
                            >
                              <FiPlus size={24} />
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="border-2 border-black text-blue-900 text-base p-5">
                        <div className="text-blue-800">
                          <h5 className="text-lg">₹{item.product.price * quantities[index]}</h5>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
          </div>
          <div className="w-1/4 p-8 bg-white rounded-xl shadow-md">
            <div className="flex flex-col items-start gap-6">
              <h2 className="text-2xl font-semibold text-gray-700">Payment</h2>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-4 text-left text-gray-600 font-medium border-b border-gray-100">Title</th>
                    <th className="p-4 text-left text-gray-600 font-medium border-b border-gray-100">Quantity</th>
                    <th className="p-4 text-left text-gray-600 font-medium border-b border-gray-100">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, index) => (
                    <tr key={index}>
                      <td className="p-4 text-left text-gray-600 text-base border-b border-gray-100">{item.product.pname}</td>
                      <td className="p-4 text-left text-gray-600 text-base border-b border-gray-100">{quantities[index]}</td>
                      <td className="p-4 text-left text-gray-600 text-base border-b border-gray-100">₹{item.product.price * quantities[index]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6">
              <div>
                <p className="text-lg font-semibold text-gray-700 my-2">Total Price: ₹{priceTotal.toFixed(2)}</p>
                <p className="text-lg font-bold text-red-600 my-2">Discount: 20%</p>
                <p className="text-lg text-gray-700 my-2">Delivery Charge: ₹50</p>
                <p className="text-lg font-semibold text-green-800 my-2">
                  Total Amount: ₹{((priceTotal - (priceTotal * 0.2)) + 50).toFixed(2)}
                </p>
              </div>
              
              <div className="my-5">
                <select
                  value={selectedAddress}
                  onChange={(e) => setSelectedAddress(e.target.value)}
                  className="w-full p-3 mt-1 border border-gray-300 rounded-md text-base"
                >
                  <option value="">Select Address</option>
                  {addresses.map((address, index) => (
                    <option key={index} value={address._id}>
                      {address.houseName}, {address.pincode}, {address.postOffice}, {address.place}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <button 
                  onClick={handleCart}
                  className="w-full bg-green-800 text-white font-bold border-none rounded-lg cursor-pointer transition-all hover:bg-green-700 hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 active:translate-y-[1px] p-4"
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;