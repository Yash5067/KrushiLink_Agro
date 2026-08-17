import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
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
import "./BulkUpload.css";

function BulkUpload() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  const role = sessionStorage.getItem("role") || "Shopkeeper";

  // Parse Excel / CSV File
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const workbook = XLSX.read(event.target.result, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const excelData = XLSX.utils.sheet_to_json(sheet);

        if (excelData.length === 0) {
          alert("The selected file is empty.");
          return;
        }

        setData(excelData);
      } catch (error) {
        console.error("Error reading file:", error);
        alert("Failed to parse file. Please upload a valid Excel or CSV sheet.");
      }
    };

    reader.readAsBinaryString(file);
  };

  // Upload Data to Database
  const uploadData = async () => {
    const owner_id = sessionStorage.getItem("user_id");

    if (!owner_id || owner_id === "null") {
      alert("Session expired. Please login again.");
      return;
    }

    if (data.length === 0) {
      alert("Please select and upload an Excel file.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/bulk-upload", {
        owner_id: owner_id,
        products: data,
      });

      console.log("Upload response:", res.data);

      alert(res.data.message || "Products uploaded successfully!");
      setData([]);
      setFileName("");
      navigate("/view-products");
    } catch (err) {
      console.error("Upload error:", err);
      alert(
        err.response?.data?.message || "Failed to bulk upload products. Check server logs."
      );
    } finally {
      setLoading(false);
    }
  };

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

          {/* Dashboard only Shop Owner  */}
          {role !== "Farmer" && (
            <li>
              <Link to="/Dashboard" className="menu-link">
                <FaTachometerAlt />
                <span>Dashboard</span>
              </Link>
            </li>
          )}

          {/* Add Product only Shop Owner  */}
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

          {/* Bulk Upload only Shop Owner see*/}
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
      <div className="main-content" style={{ padding: "30px" }}>
        <h2>Bulk Upload</h2>
        <div className="bu-card-box">
          {/* Action Buttons & File Control */}
          <div className="bu-control-panel">
            <div className="bu-file-input-wrapper">
              <input
                type="file"
                id="file-upload"
                key={fileName}
                accept=".xlsx,.xls,.csv"
                onChange={handleFile}
                className="bu-file-input"
              />
              <label htmlFor="file-upload" className="bu-choose-btn">
                {fileName ? fileName : "Choose Excel File"}
              </label>
            </div>

            <button
              onClick={uploadData}
              disabled={loading || data.length === 0}
              className={`bu-upload-btn ${data.length === 0 ? "disabled" : ""}`}
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>

          {/* Excel Data Preview Table */}
          {data.length > 0 && (
            <div className="bu-preview-section">
              <h3 className="bu-subtitle">
                Preview Selected Data ({data.length} Items)
              </h3>
              <div className="bu-table-container">
                <table className="bu-table">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Category</th>
                      <th>Brand</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th>Unit</th>
                      <th>Shop Name</th>
                      <th>Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr key={index}>
                        <td>{item.product_name || "-"}</td>
                        <td>
                          <span className="bu-badge">{item.category || "-"}</span>
                        </td>
                        <td>{item.brand_name || "-"}</td>
                        <td>₹{item.price || "0"}</td>
                        <td>{item.quantity || "0"}</td>
                        <td>{item.unit || "-"}</td>
                        <td>{item.shop_name || "-"}</td>
                        <td>{item.contact_number || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BulkUpload;