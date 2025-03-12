import React, { useState, useEffect } from 'react';
import axios from 'axios';
import route from '../route';
import { useNavigate, useParams } from 'react-router-dom';

const EditProduct = ({ setUsername, setRole, setLoggedIn }) => {
  const { _id } = useParams();
  const navigate = useNavigate();
  const value = localStorage.getItem("Auth");
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState({});
  const [isAddCategory, setAddCategory] = useState(false);

  const handleCategoryChange = (e) => {
    setProduct({ ...product, category: e.target.value });
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const { status, data } = await axios.get(`${route()}getproduct/${_id}`, { headers: { "Authorization": `Bearer ${value}` } });
      if (status === 200) {
        setUsername(data.username);
        setRole(data.role);
        setLoggedIn(true);
        setProduct(data.product);
        if (data.category.length > 0)
          setCategories(data.category[0].categories);
      }
    } catch (error) {
      console.log("error");
    }
  };

  const handleNewCategoryChange = (e) => {
    setNewCategory(e.target.value);
  };

  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      setCategories([...categories, newCategory]);
      setCategory(newCategory);
      const { status, data } = await axios.post(`${route()}editcategory`, { newCategory }, { headers: { "Authorization": `Bearer ${value}` } });
      if (status === 201) {
        alert(data.msg);
        setAddCategory(!isAddCategory);
        fetchProduct();
      } else {
        alert("error");
      }
      setNewCategory('');
    }
  };

  const handleSizeQuantityChange = (size, e) => {
    setProduct({
      ...product,
      sizeQuantities: {
        ...product.sizeQuantities,
        [size]: parseInt(e.target.value, 10) || 0,
      },
    });
  };

  const handleProductDetailChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    let arr = [];
    Object.values(e.target.files).map(async (p) => {
      const photo = await convertToBase64(p);
      arr.push(photo);
    });
    setProduct({
      ...product,
      pimages: arr,
    });
  };

  function convertToBase64(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const { status, data } = await axios.put(`${route()}editproduct/${product._id}`, { ...product }, { headers: { "Authorization": `Bearer ${value}` } });
      if (status == 201) {
        alert(data.msg);
        navigate('/company');
      } else {
        alert("Adding incomplete");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="w-4/5 mx-auto my-5 p-5 bg-gray-100 rounded-lg">
      <h2 className="text-center text-xl font-semibold mb-4">Edit Product</h2>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        {/* Category */}
        <div className="flex flex-col">
          <label className="mb-2 font-medium">Category</label>
          <div className="flex items-center gap-2">
            <select
              value={category}
              onChange={handleCategoryChange}
              disabled={categories.length === 0}
              className="p-2 text-sm rounded border border-gray-300 flex-grow"
            >
              <option value="">Select a Category</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </select>
            
            <div className="flex items-center">
              <button 
                type="button" 
                onClick={() => setAddCategory(!isAddCategory)}
                className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
              >
                +
              </button>
              {isAddCategory && (
                <div className="flex gap-2 items-center ml-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={handleNewCategoryChange}
                    placeholder="Add new category"
                    className="p-2 text-sm rounded border border-gray-300"
                  />
                  <button 
                    type="button" 
                    onClick={handleAddCategory}
                    className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Name */}
        <div className="flex flex-col">
          <label className="mb-2 font-medium">Product Name</label>
          <input
            type="text"
            name="pname"
            value={product.pname || ''}
            onChange={handleProductDetailChange}
            placeholder="Enter product name"
            className="p-2 text-sm rounded border border-gray-300 mt-2"
          />
        </div>

        {/* Price */}
        <div className="flex flex-col">
          <label className="mb-2 font-medium">Price</label>
          <input
            type="number"
            name="price"
            value={product.price || ''}
            onChange={handleProductDetailChange}
            placeholder="Enter price"
            className="p-2 text-sm rounded border border-gray-300 mt-2"
          />
        </div>

        {/* Brand (Company) */}
        <div className="flex flex-col">
          <label className="mb-2 font-medium">Brand (Company)</label>
          <input
            type="text"
            name="brand"
            value={product.brand || ''}
            disabled={true}
            placeholder="Enter brand"
            className="p-2 text-sm rounded border border-gray-300 mt-2 bg-gray-50"
          />
        </div>

        {/* Sizes and Quantities */}
        <div className="flex flex-col">
          <label className="mb-2 font-medium">Sizes (Enter Quantity)</label>
          <div className="grid grid-cols-3 gap-5">
            {['S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map((size) => (
              <div key={size} className="flex flex-col">
                <label className="mb-1">{size}</label>
                <input
                  type="number"
                  value={product.sizeQuantities?.[size] || 0}
                  onChange={(e) => handleSizeQuantityChange(size, e)}
                  placeholder="Quantity"
                  className="p-2 text-sm rounded border border-gray-300"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Images */}
        <div className="flex flex-col">
          <label className="mb-2 font-medium">Product Images</label>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="p-2 text-sm"
          />
        </div>

        <button 
          type="submit" 
          className="bg-green-500 text-white py-2 px-4 rounded self-start hover:bg-green-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default EditProduct;