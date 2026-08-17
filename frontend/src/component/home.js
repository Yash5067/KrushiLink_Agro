import React from "react";
import "./home.css";
import { Link } from "react-router-dom";
import agroshop from "./agroshop.png";
import {
    FaHome,
    FaTachometerAlt,
    FaPlusCircle,
    FaBoxOpen,
    FaMapMarkerAlt,
    FaSignOutAlt,
    FaLeaf,
    FaPhoneAlt,
    FaEnvelope,
    FaShieldAlt,
    FaClipboardList,
    FaStore,
    FaSearch
} from "react-icons/fa";

const Home = () => {
    const role = sessionStorage.getItem("role") || "ShopOwner";
    const name = sessionStorage.getItem("full_name") || "ABC";

    function logout() {
        sessionStorage.clear();
    }

    return (
        <div className="home-container">
            {/* ================= Sidebar ================= */}
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

                    {/* Dashboard visible only to Shop Owner */}
                    {role !== "Farmer" && (
                        <li>
                            <Link to="/Dashboard" className="menu-link">
                                <FaTachometerAlt />
                                <span>Dashboard</span>
                            </Link>
                        </li>
                    )}

                    {/* Add Product visible only to Shop Owner */}
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

                    {/* Bulk Upload visible only to Shop Owner */}
                    {role !== "Farmer" && (
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

            {/* ================= Main Content ================= */}
            <div className="main-content">
                {/* Header */}
                <header className="header">
                    <div className="header-left">
                        <h2 className="header-logo">🌾 KrushiLink</h2>
                        <span className="header-divider"></span>
                        <span className="welcome-text">Welcome to KrushiLink</span>
                    </div>

                    <div className="header-right-nav">
                        <span className="welcome-btn">
                            🏪 Welcome {name} ({role})
                        </span>
                    </div>
                </header>

                {/* Hero Banner with Background Image */}
                <section
                    className="hero-banner"
                    style={{
                        backgroundImage: `linear-gradient(to right, rgba(234, 245, 234, 0.95) 45%, rgba(234, 245, 234, 0.2)), url(${agroshop})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right center',
                        backgroundSize: 'cover'
                    }}
                >
                    <div className="hero-overlay-content">
                        <h1>
                            Find Fertilizers, Seeds & <span>Pesticides Easily</span>
                        </h1>

                        <div className="stats-pills">
                            <div className="pill-card">
                                <FaStore className="pill-icon" />
                                <div>
                                    <strong>25+</strong> Shops
                                </div>
                            </div>

                            <div className="pill-card">
                                <FaBoxOpen className="pill-icon" />
                                <div>
                                    <strong>10000+</strong> Products
                                </div>
                            </div>

                            <div className="pill-card">
                                <FaShieldAlt className="pill-icon" />
                                <div>
                                    <strong>1000+</strong> Farmers
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section className="about" style={{ textAlign: "center", margin: "35px 25px 25px" }}>
                    <div className="section-title">
                        <span className="title-line"></span>
                        <h2>About KrushiLink</h2>
                        <span className="title-line"></span>
                    </div>
                    <p style={{ textAlign: "center", width: "100%", display: "block", margin: "10px auto 0" }}>
                        Connecting farmers with trusted agro shops for fertilizers, seeds
                        and pesticides through one simple platform.
                    </p>
                </section>

                {/* Features Section */}
                <section className="features">
                    <div className="section-title">
                        <span className="title-line"></span>
                        <h2>Our Features</h2>
                        <span className="title-line"></span>
                    </div>

                    <div className="feature-grid">
                        {/* 1. Search Products */}
                        <div className="card">
                            <div className="icon-wrapper"><FaSearch className="icon" /></div>
                            <h3>Search Products</h3>
                            <p>Search fertilizers, seeds, pesticides and more easily.</p>
                        </div>

                        {/* 2. Nearest Shops */}
                        <div className="card">
                            <div className="icon-wrapper"><FaMapMarkerAlt className="icon" /></div>
                            <h3>Nearest Shops</h3>
                            <p>Find trusted agro-input shops near your location.</p>
                        </div>

                        {/* 3. Compare & Choose */}
                        <div className="card">
                            <div className="icon-wrapper"><FaClipboardList className="icon" /></div>
                            <h3>Compare & Choose</h3>
                            <p>Compare products, prices and choose the best option for your farm.</p>
                        </div>

                        {/* 4. Shop Information */}
                        <div className="card">
                            <div className="icon-wrapper"><FaStore className="icon" /></div>
                            <h3>Shop Information</h3>
                            <p>View shop address, contact number, working hours and available product categories.</p>
                        </div>

                        {/* 5. Trusted & Secure */}
                        <div className="card">
                            <div className="icon-wrapper"><FaShieldAlt className="icon" /></div>
                            <h3>Trusted & Secure</h3>
                            <p>Verified shops and safe shopping for a better farming experience.</p>
                        </div>
                    </div>
                </section>

                {/* Footer Section */}
                <footer className="footer">
                    <div className="footer-box">
                        <div className="footer-icon-circle">
                            <FaLeaf className="footer-icon" />
                        </div>
                        <div className="footer-text">
                            <h4>KrushiLink</h4>
                            <p>Smart Farming, Better Future.</p>
                        </div>
                    </div>

                    <div className="footer-box">
                        <div className="footer-icon-circle">
                            <FaPhoneAlt className="footer-icon" />
                        </div>
                        <div className="footer-text">
                            <h4>Call Us</h4>
                            <p>+91 1234567890</p>
                        </div>
                    </div>

                    <div className="footer-box">
                        <div className="footer-icon-circle">
                            <FaEnvelope className="footer-icon" />
                        </div>
                        <div className="footer-text">
                            <h4>Email Us</h4>
                            <p>support@krushilink.com</p>
                        </div>
                    </div>

                    <div className="footer-box">
                        <div className="footer-icon-circle">
                            <FaShieldAlt className="footer-icon" />
                        </div>
                        <div className="footer-text">
                            <h4>100% Safe & Trusted</h4>
                            <p>Secure Platform for Farmers</p>
                        </div>
                    </div>
                </footer>

                {/* Copyright */}
                <div className="copyright">
                    © 2026 KrushiLink. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default Home;