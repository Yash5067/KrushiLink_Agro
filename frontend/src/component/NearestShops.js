import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaHome,
    FaTachometerAlt,
    FaBoxOpen,
    FaPlusCircle,
    FaMapMarkerAlt,
    FaClipboardList,
    FaSignOutAlt,
    FaStore,
    FaSearch,
    FaClock,
    FaPhoneAlt,
    FaCheckCircle,
    FaBuilding
} from "react-icons/fa";
import { shopsData } from "./shopsData"; // Importing the shops data from a separate file
import "./ViewProducts.css";

function NearestShops() {
    const navigate = useNavigate();
    const role = (sessionStorage.getItem("role") || "Farmer").toLowerCase();
    const [searchTerm, setSearchTerm] = useState("");

    function logout() {
        sessionStorage.clear();
        navigate("/login");
    }

    const filteredShops = shopsData.filter((shop) =>
        shop.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="home-container" style={{ backgroundColor: "#f4f6f9", minHeight: "100vh", display: "flex" }}>
            
            {/* Sidebar */}
            <div className="sidebar">
                <h2 className="logo">🌾 <span>KrushiLink</span></h2>
                <ul className="menu">
                    <li>
                        <div onClick={() => navigate("/home")} className="menu-link" style={{ cursor: "pointer" }}>
                            <FaHome /> <span>Home</span>
                        </div>
                    </li>
                    
                    
                    {role !== "farmer" && (
                         <li>
                        <div onClick={() => navigate("/dashboard")} className="menu-link" style={{ cursor: "pointer" }}>
                            <FaTachometerAlt /> <span>Dashboard</span>
                        </div>
                    </li> 

                    )}
                    {role !== "farmer" && (
                        <li>
                            <div onClick={() => navigate("/add-product")} className="menu-link" style={{ cursor: "pointer" }}>
                                <FaPlusCircle /> <span>Add Product</span>
                            </div>
                        </li>
                    )}
                    <li>
                        <div onClick={() => navigate(role === "farmer" ? "/products" : "/view-products")} className="menu-link" style={{ cursor: "pointer" }}>
                            <FaBoxOpen /> <span>View Products</span>
                        </div>
                    </li>
                    {role !== "farmer" && (
                        <li>
                            <div onClick={() => navigate("/bulk-upload")} className="menu-link" style={{ cursor: "pointer" }}>
                                <FaClipboardList /> <span>Bulk Upload</span>
                            </div>
                        </li>
                    )}
                    <li>
                        <div onClick={() => navigate("/nearest-shops")} className="menu-link active" style={{ cursor: "pointer" }}>
                            <FaMapMarkerAlt /> <span>Nearest Shops</span>
                        </div>
                    </li>
                    <li>
                        <div className="menu-link" onClick={logout} style={{ cursor: "pointer" }}>
                            <FaSignOutAlt /> <span>Logout</span>
                        </div>
                    </li>
                </ul>
            </div>

            {/* Main Content Area */}
            <div className="main-content" style={{ padding: "30px", flex: 1, backgroundColor: "#f8f9fa", overflowY: "auto" }}>
                
                {/* Header Banner */}
                <div style={{
                    backgroundColor: "#ffffff",
                    padding: "20px 25px",
                    borderRadius: "10px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    marginBottom: "25px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    borderLeft: "6px solid #2e7d32"
                }}>
                    <div>
                        <h2 style={{ color: "#1b4d3e", fontSize: "26px", margin: 0, fontWeight: "700" }}>
                            📍 KrushiLink Verified Agro Shops & Branches
                        </h2>
                        <p style={{ color: "#6c757d", fontSize: "14px", margin: "5px 0 0 0" }}>
                            Explore official store locations, address, contact information, and available seeds, fertilizers & pesticides.
                        </p>
                    </div>
                    <div style={{
                        backgroundColor: "#e8f5e9",
                        padding: "8px 16px",
                        borderRadius: "20px",
                        color: "#2e7d32",
                        fontWeight: "bold",
                        fontSize: "14px",
                        marginTop: "10px"
                    }}>
                        Total Registered Stores: {shopsData.length}
                    </div>
                </div>

                {/* Search Bar */}
                <div style={{ marginBottom: "25px", display: "flex", gap: "15px", alignItems: "center", flexWrap: "wrap" }}>
                    <div style={{ position: "relative", flex: 1, minWidth: "280px", maxWidth: "500px" }}>
                        <input
                            type="text"
                            placeholder="Search by City, District or Shop (e.g. Pune, Kalyan, Sangamner)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "12px 16px 12px 42px",
                                borderRadius: "8px",
                                border: "1px solid #ced4da",
                                fontSize: "14px",
                                outline: "none",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.04)"
                            }}
                        />
                        <FaSearch style={{ position: "absolute", left: "15px", top: "15px", color: "#6c757d", fontSize: "15px" }} />
                    </div>
                    <span style={{ fontSize: "14px", color: "#6c757d" }}>
                        Showing <b>{filteredShops.length}</b> of <b>{shopsData.length}</b> shops
                    </span>
                </div>

                {/* Shops Cards Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
                    {filteredShops.length === 0 ? (
                        <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "50px", backgroundColor: "#fff", borderRadius: "10px" }}>
                            <h3 style={{ color: "#d32f2f" }}>No KrushiLink store found matching your search term.</h3>
                            <p style={{ color: "#6c757d" }}>Try searching for cities like Pune, Kalyan, Shahapur, Kolhapur, etc.</p>
                        </div>
                    ) : (
                        filteredShops.map((shop) => (
                            <div key={shop.id} style={{
                                backgroundColor: "#ffffff",
                                borderRadius: "10px",
                                padding: "20px",
                                boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
                                border: "1px solid #e9ecef",
                                borderTop: "4px solid #2e7d32",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between"
                            }}>
                                <div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                                        <h3 style={{ margin: 0, color: "#2e7d32", fontSize: "18px", fontWeight: "600" }}>
                                            <FaStore style={{ marginRight: "8px", verticalAlign: "middle" }} />
                                            {shop.name}
                                        </h3>
                                    </div>

                                    <div style={{ marginBottom: "12px" }}>
                                        <span style={{
                                            backgroundColor: "#e8f5e9",
                                            color: "#2e7d32",
                                            fontSize: "12px",
                                            padding: "3px 8px",
                                            borderRadius: "4px",
                                            fontWeight: "600",
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "4px"
                                        }}>
                                            <FaBuilding size={11} /> City: {shop.city} ({shop.district})
                                        </span>
                                    </div>

                                    <p style={{ margin: "8px 0", color: "#495057", fontSize: "13px", lineHeight: "1.5" }}>
                                        <FaMapMarkerAlt style={{ color: "#d32f2f", marginRight: "8px", flexShrink: 0 }} />
                                        <b>Address:</b> {shop.address}
                                    </p>

                                    <p style={{ margin: "8px 0", color: "#495057", fontSize: "13px" }}>
                                        <FaPhoneAlt style={{ color: "#1976d2", marginRight: "8px" }} />
                                        <b>Contact:</b> <span style={{ fontFamily: "monospace", fontSize: "14px" }}>{shop.contact}</span>
                                    </p>

                                    <p style={{ margin: "8px 0", color: "#495057", fontSize: "13px" }}>
                                        <FaClock style={{ color: "#f57c00", marginRight: "8px" }} />
                                        <b>Working Hours:</b> {shop.timing} ({shop.status})
                                    </p>

                                    <div style={{ marginTop: "14px", borderTop: "1px dashed #e0e0e0", paddingTop: "10px" }}>
                                        <span style={{ fontSize: "12px", fontWeight: "bold", color: "#6c757d" }}>Available Product Categories:</span>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px" }}>
                                            {shop.services.map((service, index) => (
                                                <span key={index} style={{
                                                    backgroundColor: "#f1f3f5",
                                                    color: "#343a40",
                                                    fontSize: "12px",
                                                    padding: "5px 10px",
                                                    borderRadius: "4px",
                                                    border: "1px solid #e2e8f0",
                                                    width: "fit-content"
                                                }}>
                                                    • {service}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div style={{
                                    marginTop: "15px",
                                    paddingTop: "10px",
                                    borderTop: "1px solid #f1f3f5",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    fontSize: "12px",
                                    color: "#2e7d32"
                                }}>
                                    <span style={{ display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold" }}>
                                        <FaCheckCircle size={12} /> KrushiLink Certified Outlet
                                    </span>
                                </div>

                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default NearestShops;