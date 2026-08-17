import React from "react";
import { Link } from "react-router-dom";
import {
    FaHome,
    FaTachometerAlt,
    FaBoxOpen,
    FaUsers,
    FaStore,
    FaPlusCircle,
    FaMapMarkerAlt,
    FaClipboardList,
    FaChartLine,
    FaSignOutAlt
} from "react-icons/fa";
import "./home.css";

const Dashboard = () => {
    const rawRole = sessionStorage.getItem("role") || "ShopOwner";
    const role = rawRole.toLowerCase();
    const isFarmer = role === "farmer";

    function logout() {
        sessionStorage.clear();
    }

    return (
        <div className="home-container" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
            
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

                    {/* Dashboard is visible only to Shop Owners */}
                    {!isFarmer && (
                        <li>
                            <Link to="/dashboard" className="menu-link">
                                <FaTachometerAlt />
                                <span>Dashboard</span>
                            </Link>
                        </li>
                    )}

                    {!isFarmer && (
                        <li>
                            <Link to="/add-product" className="menu-link">
                                <FaPlusCircle />
                                <span>Add Product</span>
                            </Link>
                        </li>
                    )}

                    <li>
                        <Link to={isFarmer ? "/products" : "/view-products"} className="menu-link">
                            <FaBoxOpen />
                            <span>View Products</span>
                        </Link>
                    </li>

                    {!isFarmer && (
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
            <div className="main-content" style={{ padding: "24px" }}>
                
                <header className="header" style={{ display: "flex", alignItems: "center", marginBottom: "24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <FaChartLine style={{ fontSize: "1.8rem", color: "#2e7d32" }} />
                        <h2 style={{ margin: 0, fontSize: "1.5rem", color: "#1b5e20" }}>KrushiLink Analytics & Overview</h2>
                    </div>
                </header>

                <section style={{ marginBottom: "32px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
                        <div className="stat-card" style={{ padding: "20px", borderRadius: "12px", borderLeft: "5px solid #2e7d32", backgroundColor: "#fff" }}>
                            <FaStore style={{ fontSize: "2.2rem", color: "#2e7d32", marginBottom: "8px" }} />
                            <h3 style={{ fontSize: "1.8rem", margin: "4px 0" }}>25+</h3>
                            <p style={{ margin: 0, color: "#666" }}>Registered Shops</p>
                        </div>

                        <div className="stat-card" style={{ padding: "20px", borderRadius: "12px", borderLeft: "5px solid #1b5e20", backgroundColor: "#fff" }}>
                            <FaBoxOpen style={{ fontSize: "2.2rem", color: "#1b5e20", marginBottom: "8px" }} />
                            <h3 style={{ fontSize: "1.8rem", margin: "4px 0" }}>10000+</h3>
                            <p style={{ margin: 0, color: "#666" }}>Available Products</p>
                        </div>

                        <div className="stat-card" style={{ padding: "20px", borderRadius: "12px", borderLeft: "5px solid #4caf50", backgroundColor: "#fff" }}>
                            <FaUsers style={{ fontSize: "2.2rem", color: "#4caf50", marginBottom: "8px" }} />
                            <h3 style={{ fontSize: "1.8rem", margin: "4px 0" }}>1,000+</h3>
                            <p style={{ margin: 0, color: "#666" }}>Active Farmers</p>
                        </div>

                        <div className="stat-card" style={{ padding: "20px", borderRadius: "12px", borderLeft: "5px solid #81c784", backgroundColor: "#fff" }}>
                            <FaClipboardList style={{ fontSize: "2.2rem", color: "#81c784", marginBottom: "8px" }} />
                            <h3 style={{ fontSize: "1.8rem", margin: "4px 0" }}>50+</h3>
                            <p style={{ margin: 0, color: "#666" }}>Daily Queries</p>
                        </div>
                    </div>
                </section>

                <section style={{ marginBottom: "32px" }}>
                    <h3 style={{ color: "#2e7d32", marginBottom: "16px", borderBottom: "2px solid #e0e0e0", paddingBottom: "8px" }}>
                        Platform Navigation & Actions
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
                        <Link to={isFarmer ? "/products" : "/view-products"} style={{ textDecoration: "none", color: "inherit" }}>
                            <div className="card" style={{ cursor: "pointer", height: "100%", transition: "transform 0.2s", backgroundColor: "#fff", padding: "20px", borderRadius: "12px" }}>
                                <FaBoxOpen className="icon" style={{ color: "#2e7d32", fontSize: "2rem" }} />
                                <h3>Browse Inventory</h3>
                                <p>Explore verified fertilizers, high-yield seeds, and crop pesticides.</p>
                            </div>
                        </Link>

                        <Link to="/nearest-shops" style={{ textDecoration: "none", color: "inherit" }}>
                            <div className="card" style={{ cursor: "pointer", height: "100%", transition: "transform 0.2s", backgroundColor: "#fff", padding: "20px", borderRadius: "12px" }}>
                                <FaMapMarkerAlt className="icon" style={{ color: "#2e7d32", fontSize: "2rem" }} />
                                <h3>Find Nearby Shops</h3>
                                <p>Locate agro retail stores and suppliers near your farm.</p>
                            </div>
                        </Link>

                        {!isFarmer ? (
                            <Link to="/add-product" style={{ textDecoration: "none", color: "inherit" }}>
                                <div className="card" style={{ cursor: "pointer", height: "100%", transition: "transform 0.2s", backgroundColor: "#fff", padding: "20px", borderRadius: "12px" }}>
                                    <FaPlusCircle className="icon" style={{ color: "#2e7d32", fontSize: "2rem" }} />
                                    <h3 style={{ fontSize: "1.2rem" }}>List New Stock</h3>
                                    <p>Add new agricultural goods or inventory entries to the platform.</p>
                                </div>
                            </Link>
                        ) : (
                            <Link to="/products" style={{ textDecoration: "none", color: "inherit" }}>
                                <div className="card" style={{ cursor: "pointer", height: "100%", transition: "transform 0.2s", backgroundColor: "#fff", padding: "20px", borderRadius: "12px" }}>
                                    <FaClipboardList className="icon" style={{ color: "#2e7d32", fontSize: "2rem" }} />
                                    <h3>Explore Products</h3>
                                    <p>Search and compare agricultural inputs from various shops.</p>
                                </div>
                            </Link>
                        )}
                    </div>
                </section>

                <section>
                    <h3 style={{ color: "#2e7d32", marginBottom: "16px", borderBottom: "2px solid #e0e0e0", paddingBottom: "8px" }}>
                        Recent Activity Overview
                    </h3>
                    <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", padding: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                            <thead>
                                <tr style={{ borderBottom: "2px solid #eee", color: "#555" }}>
                                    <th style={{ padding: "12px" }}>Category</th>
                                    <th style={{ padding: "12px" }}>Item Details</th>
                                    <th style={{ padding: "12px" }}>Status</th>
                                    <th style={{ padding: "12px" }}>Region</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
                                    <td style={{ padding: "12px", fontWeight: "bold" }}>Fertilizer</td>
                                    <td style={{ padding: "12px" }}>NPK 19-19-19 Standard Pack</td>
                                    <td style={{ padding: "12px", color: "#2e7d32", fontWeight: "bold" }}>Available</td>
                                    <td style={{ padding: "12px" }}>Pune District</td>
                                </tr>
                                <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
                                    <td style={{ padding: "12px", fontWeight: "bold" }}>Seeds</td>
                                    <td style={{ padding: "12px" }}>Hybrid Wheat Seeds (25kg)</td>
                                    <td style={{ padding: "12px", color: "#2e7d32", fontWeight: "bold" }}>Available</td>
                                    <td style={{ padding: "12px" }}>Nashik District</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: "12px", fontWeight: "bold" }}>Pesticides</td>
                                    <td style={{ padding: "12px" }}>Organic Bio-Pesticide Spray</td>
                                    <td style={{ padding: "12px", color: "#d32f2f", fontWeight: "bold" }}>Limited Stock</td>
                                    <td style={{ padding: "12px" }}>Ahilyanagar District</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default Dashboard;