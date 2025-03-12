import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import route from "../route";

const Signup = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  const [user, setUser] = useState({
    email: email || "",
    username: "",
    password: "",
    cpassword: "",
    role: "",
    phone: "",
    gender: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    password: "",
    cpassword: "",
    phone: "",
  });

  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validatePassword = () => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\.])[A-Za-z\d@$!%*?&\.]{8,}$/;
    return !passwordRegex.test(user.password)
      ? "Password must be at least 8 characters, include an uppercase, a number & a special character."
      : "";
  };

  const validatePhone = () => {
    return !/^[6-9]\d{9}$/.test(user.phone) ? "Phone number must be 10 digits." : "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ password: "", cpassword: "", phone: "" });

    if (user.password !== user.cpassword) {
      setErrors((prev) => ({ ...prev, cpassword: "Passwords do not match" }));
      return;
    }

    const passwordError = validatePassword();
    if (passwordError) {
      setErrors((prev) => ({ ...prev, password: passwordError }));
      return;
    }

    const phoneError = validatePhone();
    if (phoneError) {
      setErrors((prev) => ({ ...prev, phone: phoneError }));
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, status } = await axios.post(`${route()}signup`, user, {
        headers: { "Content-Type": "application/json" },
      });
      if (status === 201) {
        alert(data.msg);
        localStorage.removeItem("email");
        navigate("/");
      }
    } catch (error) {
      alert(`Error: ${error.response?.data?.msg || "An error occurred"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-white via-yellow-200 to-white">
      <div className="bg-cyan-200 p-8 w-full max-w-md rounded-lg shadow-md backdrop-blur-sm border border-white">
        <h1 className="text-2xl font-bold text-center text-gray-800">Register</h1>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Username */}
          <div>
            <label className="block text-gray-700 font-semibold">Username:</label>
            <input
              type="text"
              name="username"
              value={user.username}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700 font-semibold">Phone No:</label>
            <input
              type="text"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-gray-700 font-semibold">Gender:</label>
            <input
              type="text"
              name="gender"
              value={user.gender}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-gray-700 font-semibold">I am a:</label>
            <select
              name="role"
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">Select one option</option>
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-semibold">Password:</label>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 font-semibold">Confirm Password:</label>
            <input
              type="password"
              name="cpassword"
              value={user.cpassword}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            {errors.cpassword && <span className="text-red-500 text-sm">{errors.cpassword}</span>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gray-700 text-white py-2 rounded hover:bg-gray-500 transition"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
