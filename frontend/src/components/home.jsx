import React from 'react';

const HomePage = () => {
  return (
    <div className="bg-gray-100">
      {/* Header */}
      <header className="bg-blue-800 text-white p-4">
        <div className="flex items-center justify-between max-w-screen-xl mx-auto">
          <div className="text-2xl font-bold">
            <a href="/" className="text-white">ShopEase</a>
          </div>

          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search for products..."
              className="px-4 py-2 rounded-md focus:outline-none w-64"
            />
            <button className="bg-yellow-500 px-4 py-2 rounded-md">Cart</button>
            <button className="bg-gray-600 px-4 py-2 rounded-md">Sign In</button>
          </div>
        </div>
      </header>

      {/* Main Banner */}
      <section className="relative">
        <img
          src="https://via.placeholder.com/1500x500"
          alt="Main Banner"
          className="w-full h-96 object-cover"
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
          <h2 className="text-4xl font-bold mb-2">Welcome to ShopEase!</h2>
          <p className="text-xl">Exclusive offers just for you</p>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-8 px-4">
        <h2 className="text-3xl font-bold text-center mb-6">Shop by Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <img src="https://via.placeholder.com/100" alt="Electronics" className="mx-auto mb-2" />
            <h3 className="text-lg">Electronics</h3>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <img src="https://via.placeholder.com/100" alt="Clothing" className="mx-auto mb-2" />
            <h3 className="text-lg">Clothing</h3>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <img src="https://via.placeholder.com/100" alt="Home Appliances" className="mx-auto mb-2" />
            <h3 className="text-lg">Home Appliances</h3>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <img src="https://via.placeholder.com/100" alt="Books" className="mx-auto mb-2" />
            <h3 className="text-lg">Books</h3>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <img src="https://via.placeholder.com/100" alt="Sports" className="mx-auto mb-2" />
            <h3 className="text-lg">Sports</h3>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <img src="https://via.placeholder.com/100" alt="Beauty" className="mx-auto mb-2" />
            <h3 className="text-lg">Beauty</h3>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-200 py-8">
        <h2 className="text-3xl font-bold text-center mb-6">Featured Products</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 px-4">
          {/* Example Product */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <img
              src="https://via.placeholder.com/200"
              alt="Product 1"
              className="w-full h-40 object-cover mb-4 rounded"
            />
            <h3 className="text-lg font-semibold">Product 1</h3>
            <p className="text-gray-500">$50</p>
            <button className="bg-blue-500 text-white mt-4 w-full py-2 rounded-md">Add to Cart</button>
          </div>

          {/* Add more products here */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <img
              src="https://via.placeholder.com/200"
              alt="Product 2"
              className="w-full h-40 object-cover mb-4 rounded"
            />
            <h3 className="text-lg font-semibold">Product 2</h3>
            <p className="text-gray-500">$100</p>
            <button className="bg-blue-500 text-white mt-4 w-full py-2 rounded-md">Add to Cart</button>
          </div>

          {/* More products can be added here */}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-800 text-white py-6">
        <div className="max-w-screen-xl mx-auto text-center">
          <p>&copy; 2025 ShopEase - All Rights Reserved</p>
          <div className="flex justify-center space-x-6 mt-4">
            <a href="/" className="hover:text-yellow-500">Privacy Policy</a>
            <a href="/" className="hover:text-yellow-500">Terms of Service</a>
            <a href="/" className="hover:text-yellow-500">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
