import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    FaHome,
    // FaTachometerAlt,
    FaBoxOpen,
    FaPlusCircle,
    FaMapMarkerAlt,
    FaClipboardList,
    FaSignOutAlt,
    FaTag,
    FaBoxes,
    FaStore,
    FaPhone,
    FaSearch,
    FaRupeeSign,
    FaBuilding
} from "react-icons/fa";
import "./ViewProducts.css";

function Products() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Case-insensitive role check
    const rawRole = sessionStorage.getItem("role") || "Farmer";
    const role = rawRole.toLowerCase();

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const res = await axios.get(
                    `https://krushilink-agro.onrender.com/products?page=${page}&limit=12`
                );
                setProducts(res.data.data || []);
                setTotalPages(res.data.totalPages || 1);
            } catch (err) {
                console.error("Error fetching products:", err);
            }
        };

        loadProducts();
    }, [page]);

    function logout() {
        sessionStorage.clear();
        navigate("/login");
    }

    // Filter Logic for Search Term & Category
    const filteredProducts = products.filter((item) => {
        const matchesSearch = (item.product_name || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesCategory =
            selectedCategory === "All" || item.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="home-container" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
            
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

                    {role !== "farmer" && (
                        <li>
                            <Link to="/add-product" className="menu-link">
                                <FaPlusCircle />
                                <span>Add Product</span>
                            </Link>
                        </li>
                    )}

                    <li>
                        <Link to={role === "farmer" ? "/products" : "/view-products"} className="menu-link active">
                            <FaBoxOpen />
                            <span>View Products</span>
                        </Link>
                    </li>

                    {role !== "farmer" && (
                        <li>
                            <Link to="/bulk-upload" className="menu-link">
                                <FaClipboardList />
                                <span>Bulk Upload</span>
                            </Link>
                        </li>
                    )}

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

            {/* Main Content */}
            <div className="main-content">
                <div className="products-page">
                    <h2 className="page-title">Available Products</h2>

                    {/* Search & Filter Bar */}
                    <div className="pro-search-container">
                        <div className="pro-search-bar">
                            <div className="pro-category-dropdown">
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    <option value="All">All Categories</option>
                                    <option value="Fertilizers">Fertilizers</option>
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
                                <button className="pro-search-btn">
                                    <FaSearch />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="products-grid">
                        {filteredProducts.length === 0 ? (
                            <h3 className="no-products" style={{ textAlign: "center", gridColumn: "1/-1", margin: "40px 0" }}>
                                No Products Found
                            </h3>
                        ) : (
                            filteredProducts.map((item) => (
                                <div className="product-card" key={item.product_id || item._id}>
                                    <div>
                                        <img
                                            src={item.image ? item.image : "https://placehold.co/200x120?text=No+Image"}
                                            alt={item.product_name}
                                            className="product-image"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://placehold.co/200x120?text=No+Image";
                                            }}
                                        />

                                        <div className="card-header">
                                            <h3>{item.product_name}</h3>
                                            <span
                                                className={
                                                    item.stock_status === "In Stock" || item.quantity > 0
                                                        ? "stock in"
                                                        : "stock out"
                                                }
                                            >
                                                {item.stock_status || (item.quantity > 0 ? "IN STOCK" : "OUT OF STOCK")}
                                            </span>
                                        </div>

                                        {/* 2-Column Info Grid */}
                                        <div className="info-grid">
                                            <div className="info-item">
                                                <FaTag /> <span><b>Category:</b> {item.category}</span>
                                            </div>
                                            <div className="info-item">
                                                <FaBuilding /> <span><b>Brand:</b> {item.brand_name}</span>
                                            </div>
                                            <div className="info-item">
                                                <FaRupeeSign /> <span><b>Price:</b> ₹{item.price}</span>
                                            </div>
                                            <div className="info-item">
                                                <FaBoxes /> <span><b>Stock Qty:</b> {item.quantity} {item.unit}</span>
                                            </div>
                                            <div className="info-item">
                                                <FaBoxes /> <span><b>Packing:</b> {item.packing || item.unit || "N/A"}</span>
                                            </div>
                                            <div className="info-item">
                                                <FaStore /> <span><b>Shop:</b> {item.shop_name}</span>
                                            </div>
                                            <div className="info-item" style={{ gridColumn: "span 2" }}>
                                                <FaPhone /> <span><b>Contact:</b> {item.contact_number}</span>
                                            </div>
                                        </div>

                                        {/* Full Width Bottom Info Section */}
                                        <div className="full-width-info">
                                            <p><b>Description:</b> {item.description}</p>
                                            <p><FaMapMarkerAlt /> <b>Address:</b> {item.address}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                disabled={page === 1}
                            >
                                Previous
                            </button>

                            <span style={{margin: 10}}>
                                Page {page} of {totalPages}
                            </span>

                            <button
                                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={page === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Products;
