import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
    FaHome,
    FaTachometerAlt,
    FaBoxOpen,
    FaPlusCircle,
    FaMapMarkerAlt,
    FaClipboardList,
    FaSignOutAlt
} from "react-icons/fa";
import './AddProduct.css';
import './home.css';

function AddProduct() {
    const navigate = useNavigate();
    const role = sessionStorage.getItem("role") || "ShopOwner";

    const [product, setProduct] = useState({
        product_name: "",
        category: "Fertilizer",
        brand_name: "",
        price: "",
        quantity: "",
        unit: "",
        shop_name: "",
        contact_number: "",
        description: "",
        image: null,
        address: ""
    });

    const logout = () => {
        sessionStorage.clear();
    };

    const handleChange = (e) => {
        if (e.target.name === "image") {
            setProduct({
                ...product,
                image: e.target.files[0]
            });
        } else {
            setProduct({
                ...product,
                [e.target.name]: e.target.value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const owner_id = sessionStorage.getItem("user_id");

        if (!owner_id || owner_id === "null") {
            alert("Owner ID missing! Please Login again.");
            return;
        }

        const formData = new FormData();
        Object.keys(product).forEach((key) => {
            formData.append(key, product[key]);
        });

        try {
            const res = await axios.post(
                `https://krushilink-agro.onrender.com/add-product/${owner_id}`,
                formData
            );
            alert(res.data.message || "Product added successfully!");
            navigate("/view-products");
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to add product");
        }
    };

    return (
        <div className="home-container" style={{ minHeight: "100vh" }}>
            
            {/* Sidebar */}
            <div className="sidebar">
                <h2 className="logo">
                    🌾 <span>KrushiLink</span>
                </h2>
                <ul className="menu">
                    <li>
                        <Link to="/home" className="menu-link">
                            <FaHome />
                            <span>Home</span>
                        </Link>
                    </li>

                    <li>
                        <Link to="/Dashboard" className="menu-link">
                            <FaTachometerAlt />
                            <span>Dashboard</span>
                        </Link>
                    </li>

                    {role !== "Farmer" && (
                        <li>
                            <Link to="/add-product" className="menu-link">
                                <FaPlusCircle />
                                <span>Add Product</span>
                            </Link>
                        </li>
                    )}

                    <li>
                        <Link to={role === "Farmer" ? "/products" : "/view-products"} className="menu-link">
                            <FaBoxOpen />
                            <span>View Products</span>
                        </Link>
                    </li>

                    <li>
                        <Link to="/bulk-upload" className="menu-link">
                            <FaClipboardList />
                            <span>Bulk Upload</span>
                        </Link>
                    </li>

                    <li>
                        <Link to="/nearest-shops" className="menu-link">
                            <FaMapMarkerAlt />
                            <span>Nearest Shops</span>
                        </Link>
                    </li>

                    <li>
                        <Link to="/login" className="menu-link" onClick={logout}>
                            <FaSignOutAlt />
                            <span>Logout</span>
                        </Link>
                    </li>
                </ul>
            </div>

            {/* Main Content Area */}
            <div className="main-content" style={{ padding: "24px" }}>
                <div className="ap-main-wrapper">
                    <div className="ap-card-box">
                        <h2 className="ap-title">Add Product</h2>
                        
                        <form className="ap-form-grid" onSubmit={handleSubmit}>
                            
                            {/* Row 1 */}
                            <div className="ap-field">
                                <label>Product Name</label>
                                <input
                                    type="text"
                                    name="product_name"
                                    placeholder="Enter Product Name"
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="ap-field">
                                <label>Category</label>
                                <select name="category" onChange={handleChange}>
                                    <option value="Fertilizer">Fertilizer</option>
                                    <option value="Seed">Seed</option>
                                    <option value="Pesticide">Pesticide</option>
                                </select>
                            </div>

                            <div className="ap-field">
                                <label>Brand Name</label>
                                <input
                                    type="text"
                                    name="brand_name"
                                    placeholder="Enter Brand Name"
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Row 2 */}
                            <div className="ap-field">
                                <label>Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    placeholder="Enter Price"
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="ap-field">
                                <label>Quantity</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    placeholder="Enter Quantity"
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="ap-field">
                                <label>Unit</label>
                                <input
                                    type="text"
                                    name="unit"
                                    placeholder="Kg / Litre / Packet"
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Row 3 */}
                            <div className="ap-field">
                                <label>Shop Name</label>
                                <input
                                    type="text"
                                    name="shop_name"
                                    placeholder="Enter Shop Name"
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="ap-field">
                                <label>Contact Number</label>
                                <input
                                    type="text"
                                    name="contact_number"
                                    placeholder="Enter Contact Number"
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="ap-field">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    placeholder="Enter Product Description"
                                    onChange={handleChange}
                                ></textarea>
                            </div>

                            {/* Row 4 */}
                            <div className="ap-field">
                                <label>Product Image</label>
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="ap-field ap-span-2">
                                <label>Shop Address</label>
                                <textarea
                                    name="address"
                                    placeholder="Enter Shop Address"
                                    onChange={handleChange}
                                ></textarea>
                            </div>

                            {/* Button Row */}
                            <div className="ap-btn-row">
                                <button type="submit" className="ap-submit-btn">
                                    Add Product
                                </button>
                                <button 
                                    type="button" 
                                    className="ap-back-btn"
                                    onClick={() => navigate("/home")}
                                >
                                    Cancel
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default AddProduct;