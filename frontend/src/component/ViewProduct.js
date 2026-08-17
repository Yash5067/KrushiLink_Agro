import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ViewProducts.css";
import {
    FaHome,
    FaClipboardList,
    FaTachometerAlt,
    FaPlusCircle,
    FaBoxOpen,
    FaMapMarkerAlt,
    FaSignOutAlt,
    FaTag,
    FaBoxes,
    FaStore,
    FaPhone,
    FaSearch,
    FaBox,
    FaRupeeSign
} from "react-icons/fa";

function ViewProducts() {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const navigate = useNavigate();

    useEffect(() => {
        const owner_id = sessionStorage.getItem("user_id") || sessionStorage.getItem("owner_id");
        if (owner_id) {
            loadProducts(owner_id);
        } else {
            loadProducts("all");
        }
    }, []);

    const loadProducts = async (owner_id) => {
        try {
            const url = owner_id === "all"
                ? `http://localhost:5000/view-products`
                : `http://localhost:5000/view-products/${owner_id}`;

            const res = await axios.get(url);
            setProducts(res.data);
        } catch (err) {
            console.error("Error loading products:", err);
        }
    };

    function logout() {
        sessionStorage.clear();
    }

    const handleDelete = async (productId) => {
        const isConfirm = window.confirm("Are you sure you want to delete this product?");
        if (isConfirm) {
            try {
                const res = await axios.delete(`http://localhost:5000/delete-product/${productId}`);
                if (res.status === 200) {
                    alert("Product deleted successfully!");
                    setProducts(products.filter((item) => (item._id || item.product_id) !== productId));
                }
            } catch (err) {
                console.error("Delete error:", err);
                alert("Failed to delete product.");
            }
        }
    };

    const filteredProducts = products.filter((item) => {
        const matchesSearch = item.product_name
            ? item.product_name.toLowerCase().includes(searchTerm.toLowerCase())
            : true;

        const matchesCategory =
            selectedCategory === "All" || item.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="home-container">
            {/* Sidebar Matching Screenshot */}
            <div className="sidebar">
                <h2 className="logo">🌾 <span>KrushiLink</span></h2>
                <ul className="menu">
                    <li>
                        <Link to="/home" className="menu-link">
                            <FaHome /><span>Home</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/Dashboard" className="menu-link">
                            <FaTachometerAlt />
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/add-product" className="menu-link">
                            <FaPlusCircle />
                            <span>Add Product</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/view-products" className="menu-link active">
                            <FaBoxOpen /><span>View Products</span>
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
                            <FaMapMarkerAlt /><span>Nearest Shops</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/login" className="menu-link" onClick={logout}>
                            <FaSignOutAlt /><span>Logout</span>
                        </Link>
                    </li>
                </ul>
            </div>

            {/* Main Content Area */}
            <div className="main-content">
                <div className="products-page">
                    <h2 className="page-title">Available Products</h2>

                    {/* Search & Filter Bar */}
                    <div className="pro-search-container">
                        <div className="pro-search-bar">
                            <div className="pro-category-dropdown">
                                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                                    <option value="All">All Categories</option>
                                    <option value="Fertilizer">Fertilizer</option>
                                    <option value="Seeds">Seeds</option>
                                    <option value="Pesticides">Pesticides</option>
                                </select>
                            </div>
                            <div className="pro-input-wrapper">
                                <input
                                    type="text"
                                    placeholder="Search product name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <button className="pro-search-btn"><FaSearch /></button>
                            </div>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="products-grid">
                        {filteredProducts.length === 0 ? (
                            <h3 style={{ textAlign: "center", width: "100%", color: "#666" }}>No Products Found</h3>
                        ) : (
                            filteredProducts.map((item) => {
                                const idToUse = item.product_id || item._id;
                                return (
                                    <div className="product-card" key={idToUse}>
                                        <div className="card-top">
                                            {/* Product Image */}
                                            <img
                                                className="product-image"
                                                src={item.image ? `http://localhost:5000/uploads/${item.image}` : "https://placehold.co/200x120?text=No+Image"}
                                                alt={item.product_name}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://placehold.co/200x120?text=No+Image";
                                                }}
                                            />

                                            {/* Header: Title & Stock Status Badge */}
                                            <div className="card-header">
                                                <h3>{item.product_name}</h3>
                                                <span className={`stock ${item.stock_status === "Out of Stock" ? "out" : "in"}`}>
                                                    {item.stock_status || "IN STOCK"}
                                                </span>
                                            </div>

                                            {/* Info Grid Matching UI */}
                                            <div className="info-grid">
                                                <p className="info-item"><FaTag /> <span><b>Category:</b> {item.category || "N/A"}</span></p>
                                                <p className="info-item"><span><b>Brand:</b> {item.brand_name || "N/A"}</span></p>
                                                <p className="info-item"><FaRupeeSign /> <span><b>Price:</b> ₹{item.price}</span></p>
                                                <p className="info-item"><FaBoxes /> <span><b>Stock Qty:</b> {item.quantity}</span></p>
                                                <p className="info-item"><FaBox /> <span><b>Packing:</b> {item.unit || item.packing || "N/A"}</span></p>
                                                <p className="info-item"><FaStore /> <span><b>Shop:</b> {item.shop_name || "N/A"}</span></p>
                                                <p className="info-item" style={{ gridColumn: "span 2" }}>
                                                    <FaPhone /> <span><b>Contact:</b> {item.contact_number || "N/A"}</span>
                                                </p>
                                            </div>

                                            {/* Description & Address Section */}
                                            <div className="full-width-info">
                                                <p><b>Description:</b> {item.description || "No description provided."}</p>
                                                <p><FaMapMarkerAlt /> <b>Address:</b> {item.address || "N/A"}</p>
                                            </div>
                                        </div>

                                        {/* Edit/Delete Action Buttons */}
                                        <div className="card-buttons">
                                            <button
                                                className="edit-btn"
                                                onClick={() => navigate(`/edit-product/${idToUse}`, { state: { productData: item } })}
                                            >
                                                Edit
                                            </button>
                                            <button className="delete-btn" onClick={() => handleDelete(idToUse)}>Delete</button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewProducts;