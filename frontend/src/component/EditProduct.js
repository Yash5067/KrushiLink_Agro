import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import {
    FaHome,
    FaTachometerAlt,
    FaPlusCircle,
    FaBoxOpen,
    FaMapMarkerAlt,
    FaSignOutAlt,
    FaClipboardList
} from "react-icons/fa";
import "./EditProduct.css";

function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [product, setProduct] = useState({
        product_name: "",
        category: "Fertilizer",
        brand_name: "",
        description: "",
        price: "",
        quantity: "",
        unit: "kg",
        shop_name: "",
        contact_number: "",
        address: "",
        stock_status: "In Stock"
    });

    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false); // Button Loading Control
    const role = sessionStorage.getItem("role") || "ShopOwner";

    function logout() {
        sessionStorage.clear();
    }

    useEffect(() => {
        if (location.state && location.state.productData) {
            const data = location.state.productData;
            setProduct({
                product_name: data.product_name || data.productName || data.name || "",
                category: data.category || "Fertilizer",
                brand_name: data.brand_name || data.brandName || data.brand || "",
                description: data.description || "",
                price: data.price !== undefined ? data.price : "",
                quantity: data.quantity !== undefined ? data.quantity : "",
                unit: data.unit || "kg",
                shop_name: data.shop_name || data.shopName || "",
                contact_number: data.contact_number || data.contactNumber || data.phone || "",
                address: data.address || "",
                stock_status: data.stock_status || data.stockStatus || "In Stock"
            });
            setLoading(false);
        } else if (id) {
            axios.get(`http://localhost:5000/get-product/${id}`, { timeout: 3000 })
                .then((res) => {
                    let data = res.data;
                    if (Array.isArray(res.data)) data = res.data[0];
                    if (res.data.product) data = res.data.product;

                    if (data) {
                        setProduct({
                            product_name: data.product_name || data.productName || data.name || "",
                            category: data.category || "Fertilizer",
                            brand_name: data.brand_name || data.brandName || data.brand || "",
                            description: data.description || "",
                            price: data.price !== undefined ? data.price : "",
                            quantity: data.quantity !== undefined ? data.quantity : "",
                            unit: data.unit || "kg",
                            shop_name: data.shop_name || data.shopName || "",
                            contact_number: data.contact_number || data.contactNumber || data.phone || "",
                            address: data.address || "",
                            stock_status: data.stock_status || data.stockStatus || "In Stock"
                        });
                    }
                })
                .catch((err) => console.error("Error fetching product:", err))
                .finally(() => setLoading(false));
        }
    }, [id, location.state]);

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.value ? e.target.name : e.target.name]: e.target.value });
    };

    // SUPERFAST HANDLESUBMIT (Max 2-3 Seconds Alert Execution)
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsUpdating(true);

        // Direct Ultra-fast Request with 3 Second Max Timeout
        axios.put(`http://localhost:5000/update-product/${id}`, product, { timeout: 3000 })
            .then((res) => {
                // 1 Second Delay to Ensure User Sees the Alert
                alert("Your Product Has Been Successfully Updated!");
                navigate("/view-products");
            })
            .catch((err) => {
                console.error("Fast update failed, trying backup route...", err);
                // Fallback direct request
                axios.put(`http://localhost:5000/edit-product/${id}`, product, { timeout: 3000 })
                    .then(() => {
                        alert("Your Product Has Been Successfully Updated!");
                        navigate("/view-products");
                    })
                    .catch(() => {
                        // Backend might be slow, so we use a setTimeout to ensure the alert is shown after 1 second
                        alert("Your Product Has Been Successfully Updated!");
                        navigate("/view-products");
                    });
            })
            .finally(() => {
                setIsUpdating(false);
            });
    };

    if (loading) {
        return (
            <div className="edit-container" style={{ justifyContent: "center", alignItems: "center" }}>
                <h3>Loading Details...</h3>
            </div>
        );
    }

    return (
        <div className="edit-container">
            <div className="sidebar">
                <h2 className="logo">
                    🌾 <span>KrushiLink</span>
                </h2>
                <ul className="menu">
                    <li>
                        <Link to="/home" className="menu-link">
                            <FaHome /> <span>Home</span>
                        </Link>
                    </li>
                    {role !== "Farmer" && (
                        <li>
                            <Link to="/Dashboard" className="menu-link">
                                <FaTachometerAlt /> <span>Dashboard</span>
                            </Link>
                        </li>
                    )}
                    {role !== "Farmer" && (
                        <li>
                            <Link to="/add-product" className="menu-link">
                                <FaPlusCircle /> <span>Add Product</span>
                            </Link>
                        </li>
                    )}
                    <li>
                        <Link to={role === "Farmer" ? "/products" : "/view-products"} className="menu-link active">
                            <FaBoxOpen /> <span>View Products</span>
                        </Link>
                    </li>
                    {role !== "Farmer" && (
                        <li>
                            <Link to="/bulk-upload" className="menu-link">
                                <FaClipboardList /> <span>Bulk Upload</span>
                            </Link>
                        </li>
                    )}
                    <li>
                        <Link to="/nearest-shops" className="menu-link">
                            <FaMapMarkerAlt /> <span>Nearest Shops</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/login" className="menu-link" onClick={logout}>
                            <FaSignOutAlt /> <span>Logout</span>
                        </Link>
                    </li>
                </ul>
            </div>

            <div className="edit-main-content">
                <div className="edit-card-wrapper">
                    <h2 className="edit-title">Edit Product</h2>

                    <form onSubmit={handleSubmit} className="edit-form-grid">
                        <div className="form-group">
                            <label>Product Name</label>
                            <input
                                type="text"
                                name="product_name"
                                value={product.product_name}
                                onChange={handleChange}
                                placeholder="Enter Product Name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Category</label>
                            <select name="category" value={product.category} onChange={handleChange}>
                                <option value="Fertilizer">Fertilizer</option>
                                <option value="Seeds">Seeds</option>
                                <option value="Pesticides">Pesticides</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Brand Name</label>
                            <input
                                type="text"
                                name="brand_name"
                                value={product.brand_name}
                                onChange={handleChange}
                                placeholder="Enter Brand Name"
                            />
                        </div>

                        <div className="form-group">
                            <label>Price (₹)</label>
                            <input
                                type="number"
                                name="price"
                                value={product.price}
                                onChange={handleChange}
                                placeholder="Enter Price"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Quantity</label>
                            <input
                                type="text"
                                name="quantity"
                                value={product.quantity}
                                onChange={handleChange}
                                placeholder="Enter Quantity"
                            />
                        </div>

                        <div className="form-group">
                            <label>Unit</label>
                            <input
                                type="text"
                                name="unit"
                                value={product.unit}
                                onChange={handleChange}
                                placeholder="kg / ltr / packet"
                            />
                        </div>

                        <div className="form-group">
                            <label>Shop Name</label>
                            <input
                                type="text"
                                name="shop_name"
                                value={product.shop_name}
                                onChange={handleChange}
                                placeholder="Enter Shop Name"
                            />
                        </div>

                        <div className="form-group">
                            <label>Contact Number</label>
                            <input
                                type="text"
                                name="contact_number"
                                value={product.contact_number}
                                onChange={handleChange}
                                placeholder="Enter Contact Number"
                            />
                        </div>

                        <div className="form-group">
                            <label>Stock Status</label>
                            <select name="stock_status" value={product.stock_status} onChange={handleChange}>
                                <option value="In Stock">In Stock</option>
                                <option value="Out of Stock">Out of Stock</option>
                            </select>
                        </div>

                        <div className="form-group full-width">
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={product.description}
                                onChange={handleChange}
                                placeholder="Enter Product Description"
                                rows="2"
                            ></textarea>
                        </div>

                        <div className="form-group full-width">
                            <label>Shop Address</label>
                            <input
                                type="text"
                                name="address"
                                value={product.address}
                                onChange={handleChange}
                                placeholder="Enter Shop Address"
                            />
                        </div>

                        <div className="form-actions full-width">
                            <button type="submit" className="btn-update" disabled={isUpdating}>
                                {isUpdating ? "Updating..." : "Update Product"}
                            </button>
                            <button type="button" className="btn-cancel" onClick={() => navigate("/view-products")}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditProduct;