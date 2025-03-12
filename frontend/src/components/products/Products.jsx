import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import route from '../route';
import { Link, useParams } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';

const Products = ({ setUsername, setRole, setLoggedIn }) => {
  const {category} = useParams();
  const value = localStorage.getItem("Auth");
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    fetchProducts();
  }, []);
  
  const fetchProducts = async () => {
    try {
      const {status, data} = await axios.get(
        `${route()}products/${category}`,
        {headers: {"Authorization": `Bearer ${value}`}}
      );
      if(status) {
        setUsername(data.username);
        setRole(data.role);
        setLoggedIn(true);
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  
  return (
    <div className="flex flex-wrap gap-8 justify-start p-10 transition-all duration-300 ease-in-out">
      {products && products.length > 0 ? (
        products.map((product) => (
          <div key={product._id} className="flex bg-white border border-black rounded-xl overflow-hidden h-[420px]">
            {product.pimages && product.pimages.length > 0 && (
              <div className="w-3/5 h-full mr-8 mt-3 ml-3">
                <div className="flex flex-col items-center">
                  {product.pimages && product.pimages.length > 0 ? (
                    <>
                      <div className="w-full h-[70%] mb-5">
                        <img 
                          id='img' 
                          src={product.pimages[0]} 
                          alt="Main Product" 
                          className="w-[550px] h-[350px] object-contain border border-gray-300 rounded-lg" 
                        />
                      </div>
                    </>
                  ) : (
                    <p>No images available</p>
                  )}
                </div>
              </div>
            )}
            <div className="flex flex-col p-5 gap-4 w-[350px] h-full">
              <div>
                <div className="text-base text-gray-800 mb-2.5 flex justify-between px-0">
                  <strong>Category: </strong> 
                  <span className='text-sm font-medium text-black'> {product.category.toUpperCase()}</span>
                </div>
                
                <div className="text-base text-gray-800 mb-2.5 flex justify-between px-0">
                  <strong>Product Name: </strong> 
                  <span className='text-lg font-semibold text-black capitalize'> {product.pname}</span>
                </div>
                
                <div className="text-base text-gray-800 mb-2.5 flex justify-between px-0">
                  <strong>Brand:</strong>{product.brand}
                </div>
                
                <div className="text-base text-gray-800 mb-2.5 flex justify-between px-0">
                  <strong>Price:</strong>
                  <span className='text-xl font-bold text-black'>₹{product.price.toFixed(2)}</span>
                </div>
              </div>
              <div>
                <strong>Sizes:</strong>
                <div className="flex flex-wrap gap-2.5">
                  {Object.keys(product.sizeQuantities).map((size) => (
                    <div 
                      key={size} 
                      className="bg-[#4a5400] text-white flex justify-center items-center w-20 h-10 rounded font-normal transition-colors duration-300 cursor-pointer hover:bg-[#6c7714]"
                    >
                      <strong>{size} : {product.sizeQuantities[size]}</strong>
                    </div>
                  ))}
                </div>
              </div>
              <Link to={`/editproduct/${product._id}`}>
                <button className="bg-[#275fed] text-white border-none py-3 px-4 rounded-lg cursor-pointer text-base font-bold inline-flex items-center gap-2.5 transition-colors duration-300 w-2/5 hover:bg-[#2e16e0] active:bg-[#171bda]">
                  <FaEdit className="text-lg transition-colors duration-300" />
                  Edit
                </button>
              </Link>
            </div>
          </div>
        ))
      ) : (
        <p>No products available</p>
      )}
    </div>
  );
};

export default Products;