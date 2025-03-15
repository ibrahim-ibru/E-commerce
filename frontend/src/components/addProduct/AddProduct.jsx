import React, { useState, useEffect } from 'react';
import axios from 'axios';
import route from '../route';
import { useNavigate } from 'react-router-dom';

const AddProduct = ({setUsername, setRole, setLoggedIn }) => {
    const navigate = useNavigate();
    const value = localStorage.getItem("Auth")
    const [category, setCategory] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [categories, setCategories] = useState([]); 
    const [brand, setBrand] = useState("")
    const [productDetails, setProductDetails] = useState({
        pname: '',
        price: '',
        sizeQuantities: {
            S: 0, M: 0, L: 0, XL: 0, XXL: 0, XXXL: 0,
        },
        pimages: [],
    });
    const [isAddCategory, setAddCategory] = useState(false)

    useEffect(() => {
        getEssentials();
    }, []);

    const getEssentials = async () => {
        try {
            const { status, data } = await axios.get(`${route()}company`, { 
                headers: { "Authorization": `Bearer ${value}` } 
            });
            if (status === 200) {
                setUsername(data.username)
                setRole(data.role);
                setLoggedIn(true);
                if (data.category.length > 0) 
                    setCategories(data.category[0].categories);
                if (data.company) {
                    setBrand(data.company.name)
                }
            }
        } catch (error) {
            console.error("Error fetching essentials:", error);
        }
    };

    const handleNewCategoryChange = (e) => {
        setNewCategory(e.target.value);
    };

    const handleAddCategory = async () => {
        if (newCategory.trim()) {
            try {
                const {status, data} = await axios.post(
                    `${route()}editcategory`,
                    {newCategory},
                    {headers: {"Authorization": `Bearer ${value}`}}
                );
                if (status === 201) {
                    setCategories([...categories, newCategory]);
                    setCategory(newCategory);
                    alert(data.msg);
                    setAddCategory(false);
                    setNewCategory('');
                } else {
                    alert("Error adding category");
                }
            } catch (error) {
                console.error("Category add error:", error);
            }
        }
    };

    const handleSizeQuantityChange = (size, e) => {
        setProductDetails({
            ...productDetails,
            sizeQuantities: {
                ...productDetails.sizeQuantities,
                [size]: parseInt(e.target.value, 10) || 0,
            },
        });

        
    };
    
    const handleProductDetailChange = (e) => {
        const { name, value } = e.target;
        setProductDetails({
            ...productDetails,
            [name]: value,
        });
    };
    
    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);
        const imagePromises = files.map(convertToBase64);
        const images = await Promise.all(imagePromises);
        
        setProductDetails({
            ...productDetails,
            pimages: images,
        });
    };
    
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => resolve(fileReader.result);
            fileReader.onerror = (error) => reject(error);
        });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(productDetails.sizeQuantities);
        try {
            const { status, data } = await axios.post(
                `${route()}addproduct`, 
                {...productDetails, brand, category},
                {headers: {"Authorization": `Bearer ${value}`}}
            );
            
            if (status === 201) {
                alert(data.msg);
                navigate('/company');
            } else {
                alert("Adding product incomplete");
            }
        } catch (error) {
            console.error("Submit error:", error);
            alert("Error submitting product");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-5">
            <div className="w-full max-w-4xl bg-slate-800 rounded-xl shadow-md p-6 md:p-8">
                <h2 className="text-center text-blue-500 mb-8 text-2xl md:text-3xl font-bold">Add Product</h2>
                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    {/* Category Section */}
                    <div className="w-full bg-gray-50 rounded-lg p-5 mb-4">
                        <div className="mb-2">
                            <label className="text-gray-700 font-medium mb-1 block">Product Category</label>
                            <div className="flex items-center gap-2 md:flex-row flex-col">
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    disabled={categories.length === 0}
                                    className="flex-grow p-2 border border-gray-300 rounded-md text-sm"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat, index) => (
                                        <option key={index} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                
                                <button 
                                    type="button" 
                                    className="bg-teal-500 text-white border-none p-2 rounded-md cursor-pointer hover:bg-gray-300 hover:text-black"
                                    onClick={() => setAddCategory(!isAddCategory)}
                                >
                                    +
                                </button>
                            </div>
                            
                            {isAddCategory && (
                                <div className="flex gap-2 mt-2">
                                    <input
                                        type="text"
                                        value={newCategory}
                                        onChange={handleNewCategoryChange}
                                        placeholder="New category name"
                                        className="flex-grow p-2 border border-gray-300 rounded-md"
                                    />
                                    <button 
                                        type="button" 
                                        onClick={handleAddCategory}
                                        className="bg-blue-500 text-white border-none px-4 py-2 rounded-md cursor-pointer"
                                    >
                                        Add
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Product Details Section */}
                    <div className="w-full bg-gray-50 rounded-lg p-5 mb-4">
                        <div className="flex flex-col md:flex-row gap-5">
                            <div className="flex-1 flex flex-col gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-gray-700 font-medium">Product Name</label>
                                    <input
                                        type="text"
                                        name="pname"
                                        value={productDetails.pname}
                                        onChange={handleProductDetailChange}
                                        placeholder="Enter product name"
                                        required
                                        className="p-2 border border-gray-300 rounded-md text-sm"
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-gray-700 font-medium">Price</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={productDetails.price}
                                        onChange={handleProductDetailChange}
                                        placeholder="Enter price"
                                        required
                                        className="p-2 border border-gray-300 rounded-md text-sm"
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-gray-700 font-medium">Brand</label>
                                    <input
                                        type="text"
                                        name="brand"
                                        value={brand}
                                        disabled
                                        className="p-2 border border-gray-300 rounded-md text-sm bg-gray-100 cursor-not-allowed"
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-gray-700 font-medium">Product Images</label>
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        className="p-2 border border-gray-300 rounded-md text-sm"
                                    />
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-gray-700 font-medium">Sizes & Quantities</label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {['S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map((size) => (
                                            <div key={size} className="flex flex-col gap-1">
                                                <label className="text-center">{size}</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={productDetails.sizeQuantities[size]}
                                                    onChange={(e) => handleSizeQuantityChange(size, e)}
                                                    placeholder="Qty"
                                                    className="p-2 border border-gray-300 rounded-md text-sm text-center"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-center mt-5">
                        <button type="submit" className="bg-blue-500 text-white border-none px-8 py-3 rounded-lg text-base cursor-pointer transition-colors hover:bg-blue-600">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;