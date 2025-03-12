import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import route from "../route";
import axios from "axios";
import { FiMinus, FiPlus } from "react-icons/fi";

const SCart = ({ setUsername, setRole, setLoggedIn }) => {
  const navigate = useNavigate();
  const { pid } = useParams();
  const value = localStorage.getItem("Auth");
  const [cartItem, setCartItem] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [priceTotal, setPriceTotal] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");

  useEffect(() => {
    getCart();
  }, []);

  const getCart = async () => {
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
    }
  };

  const handleQuantityChange = async (id, type) => {
    const { status } = await axios.post(
      `${route()}editquantity`,
      { id, quantity, type },
      { headers: { Authorization: `Bearer ${value}` } }
    );
    if (status === 201) {
      getCart();
    }
  };

  const handleCart = async () => {
    const { status, data } = await axios.post(
      `${route()}buynow`,
      { id: pid },
      { headers: { Authorization: `Bearer ${value}` } }
    );
    if (status === 201 && data.msg === "success") navigate("/home");
  };

  return (
    <div className="min-h-screen bg-white px-4 md:px-8 py-6">
      <h2 className="text-2xl md:text-3xl font-bold text-teal-800 text-center mb-6">
        Buying Section
      </h2>

      {!cartItem ? (
        <div className="text-center text-gray-600 mt-10">
          <h2 className="text-2xl font-semibold text-gray-700">No such product</h2>
          <Link to={"/home"} className="text-teal-600 hover:text-teal-800 text-lg">
            Go to homepage
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2 bg-white shadow-lg rounded-lg p-6">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left border">Product</th>
                  <th className="p-3 text-left border">Title</th>
                  <th className="p-3 text-left border">Price</th>
                  <th className="p-3 text-left border">Quantity</th>
                  <th className="p-3 text-left border">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr key={cartItem._id} className="text-center bg-gray-50">
                  <td className="p-3 border">
                    <Link to={`/product/${cartItem.product._id}`}>
                      <img
                        src={cartItem.product.pimages[0]}
                        alt={cartItem.product.pname}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    </Link>
                  </td>
                  <td className="p-3 border text-lg font-semibold text-gray-700">{cartItem.product.pname}</td>
                  <td className="p-3 border text-lg text-gray-800">₹{cartItem.product.price}</td>
                  <td className="p-3 border">
                    <div className="flex items-center justify-center space-x-3">
                      <span
                        className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full cursor-pointer"
                        onClick={() => handleQuantityChange(cartItem._id, "decrease")}
                      >
                        <FiMinus size={20} />
                      </span>
                      <span className="px-4 py-2 border bg-gray-100 rounded-md">{quantity}</span>
                      <span
                        className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full cursor-pointer"
                        onClick={() => handleQuantityChange(cartItem._id, "increase")}
                      >
                        <FiPlus size={20} />
                      </span>
                    </div>
                  </td>
                  <td className="p-3 border text-lg text-green-700 font-semibold">
                    ₹{cartItem.product.price * quantity}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Cart Summary */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left border">Title</th>
                  <th className="p-3 text-left border">Quantity</th>
                  <th className="p-3 text-left border">Price</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-center">
                  <td className="p-3 border">{cartItem.product.pname}</td>
                  <td className="p-3 border">{quantity}</td>
                  <td className="p-3 border">₹{cartItem.product.price * quantity}</td>
                </tr>
              </tbody>
            </table>

            <div className="mt-6">
              <p className="text-lg font-semibold">Total Price: ₹{priceTotal.toFixed(2)}</p>
              <p className="text-red-500 font-bold">Discount: 20%</p>
              <p>Delivery Charge: ₹50</p>
              <p className="text-green-700 font-bold text-lg">
                Total Amount: ₹{((priceTotal - priceTotal * 0.2) + 50).toFixed(2)}
              </p>
            </div>

            {/* Address Dropdown */}
            <div className="mt-6">
              <h4 className="text-lg font-semibold">Select Address</h4>
              <select
                className="w-full p-3 border rounded-md mt-2"
                value={selectedAddress}
                onChange={(e) => setSelectedAddress(e.target.value)}
              >
                <option value="">Select Address</option>
                {addresses.map((address, index) => (
                  <option key={index} value={address._id}>
                    {address.houseName}, {address.pincode}, {address.postOffice}, {address.place}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleCart}
              className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition"
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SCart;
