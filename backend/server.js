require('dotenv').config();
// Developed by Yash Auti - KrushiLink Project 2026
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');
const transporter = require('./mailer');

const multer = require("multer");
const path = require("path");

// ============================================================
// Aiven Cloud MySQL connection — using a POOL instead of a single
// connection. A single `createConnection` throws an unhandled
// 'error' event (and crashes the whole Node process, like the
// ECONNREFUSED / ER_ACCESS_DENIED crashes you were seeing) the
// moment the socket drops or the cloud DB closes an idle
// connection. A pool re-establishes connections automatically and
// keeps the app alive.
// ============================================================
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT), // env vars are strings — must be a number
    ssl: {
        rejectUnauthorized: false
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise();

// Quick sanity check on boot (pool doesn't connect immediately like createConnection did)
db.query("SELECT 1")
    .then(() => console.log("database connected"))
    .catch((err) => console.error("Database connection failed:", err.message));

const app = express();
app.use(cors());
app.use(express.json());
// app.use("/uploads", express.static("uploads")); //local img storage

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "uploads");
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + path.extname(file.originalname));
//     }
// });

// const upload = multer({
//     storage: storage
// });


const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "krushilink-products", // folder name in your Cloudinary account
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
    },
});

const upload = multer({ storage: storage });

// Your products.category column is ENUM('Fertilizer','Seed','Pesticide')
// (singular). Excel bulk-upload sheets and some frontend dropdowns send
// plural values like "Fertilizers"/"Seeds"/"Pesticides", which MySQL
// rejects with "Data truncated for column 'category'". Normalize here
// so any of these are accepted safely.
function normalizeCategory(value) {
    const v = (value || "").trim().toLowerCase();
    if (v.startsWith("fert")) return "Fertilizer";
    if (v.startsWith("seed")) return "Seed";
    if (v.startsWith("pest")) return "Pesticide";
    return value; // fall through unchanged if it doesn't match — will still error clearly if truly invalid
}

app.post('/register', async (req, res) => {
    try {
        console.log("Request body:", req.body);

        const { full_name, name, email, phone, password, role } = req.body;
        const userName = full_name || name;
        const allowedRoles = ["Farmer", "ShopOwner"]; // matches ENUM('Farmer','ShopOwner') in users table
        const normalizedRole = role?.trim();

        if (!userName || !email || !phone || !password || !normalizedRole) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const roleToInsert = normalizedRole === "Shop Owner" ? "ShopOwner" : normalizedRole;

        if (!allowedRoles.includes(roleToInsert)) {
            return res.status(400).json({ message: "Invalid role selected" });
        }

        const [existingUsers] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const insertQuery = "INSERT INTO users (full_name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)";
        const [result] = await db.query(insertQuery, [userName, email, phone, hashedPassword, roleToInsert]);

        console.log("User registered with ID:", result.insertId);
        return res.status(201).json({
            message: "Registration Successful"
        });
    } catch (err) {
        console.log(err);

        if (err?.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ message: "Email or phone already registered" });
        }

        return res.status(500).json({ message: "Server error" });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("Email entered:", email);

        const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

        if (users.length === 0) {
            console.log("Email not found");
            return res.status(401).json({
                message: "invalid email"
            });
        }

        console.log("Password from DB:", users[0].password);

        const isMatch = await bcrypt.compare(password, users[0].password);

        console.log("Password Match:", isMatch);

        if (!isMatch) {
            console.log("Password incorrect");
            return res.status(401).json({
                message: "invalid password"
            });
        }

        return res.json({
            message: "login successful",
            user: {
                user_id: users[0].user_id,
                full_name: users[0].full_name,
                role: users[0].role
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Server error"
        });
    }
});

app.get("/register", async (req, res) => {
    try {
        const [users] = await db.query("SELECT * FROM users");
        res.json(users);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

//================ Add Product =================//
// NOTE: your products table (defaultbdb schema) does NOT have an
// "image" column. This insert will fail with
// "Unknown column 'image' in 'field list'" against that schema.
// Run this once in your Aiven MySQL to match what this code needs:
//
//   ALTER TABLE products ADD COLUMN image VARCHAR(255) AFTER description;
//
// Also note: your schema's category is ENUM('Fertilizer','Seed','Pesticide')
// (singular), while some frontend dropdowns send "Fertilizers","Seeds",
// "Pesticides" (plural) — those inserts will fail too unless you either
// widen the ENUM or fix the frontend values to match exactly.

app.post("/add-product/:owner_id", upload.single("image"), async (req, res) => {
    try {
        const owner_id = req.params.owner_id;

        const {
            product_name,
            category,
            brand_name,
            description,
            price,
            quantity,
            unit,
            shop_name,
            address,
            contact_number
        } = req.body;

        // const image = req.file ? req.file.filename : null;
        const image = req.file ? req.file.path : null; // Cloudinary gives the full hosted URL here
        const stock_status = Number(quantity) > 0 ? "In Stock" : "Out of Stock";

        const sql = `
        INSERT INTO products
        (
            owner_id,
            product_name,
            category,
            brand_name,
            description,
            image,
            price,
            quantity,
            unit,
            shop_name,
            address,
            contact_number,
            stock_status
        )
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
        `;

        const [result] = await db.query(sql, [
            owner_id,
            product_name,
            normalizeCategory(category),
            brand_name,
            description,
            image,
            price,
            quantity,
            unit,
            shop_name,
            address,
            contact_number,
            stock_status
        ]);

        res.status(201).json({
            success: true,
            message: "Product Added Successfully",
            product_id: result.insertId
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ================= BULK UPLOAD API ROUTE =================
app.post("/bulk-upload", async (req, res) => {
    const { owner_id, products } = req.body;

    if (!owner_id || !products || products.length === 0) {
        return res.status(400).json({ message: "Invalid payload or empty file." });
    }

    try {
        const values = products.map((item) => [
            owner_id,
            item.product_name || "",
            normalizeCategory(item.category),
            item.brand_name || "",
            item.description || "",
            item.image || null,
            item.price || 0,
            item.quantity || 0,
            item.unit || "",
            item.shop_name || "",
            item.address || "",
            item.contact_number || "",
            item.stock_status || "In Stock"
        ]);

        const sql = `
          INSERT INTO products 
          (owner_id, product_name, category, brand_name, description, image, price, quantity, unit, shop_name, address, contact_number, stock_status) 
          VALUES ?
        `;

        const [result] = await db.query(sql, [values]);

        return res.status(200).json({
            message: `${result.affectedRows} products uploaded successfully!`
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error." });
    }
});

//================ View Products =================//

app.get("/view-products/:owner_id", async (req, res) => {
    try {
        const owner_id = req.params.owner_id;

        const sql = `
        SELECT *
        FROM products
        WHERE owner_id=?
        ORDER BY product_id DESC
        `;

        const [products] = await db.query(sql, [owner_id]);
        res.json(products);
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

// Delete Product API Route
app.delete("/delete-product/:id", async (req, res) => {
    const productId = req.params.id;
    try {
        const sql = "DELETE FROM products WHERE product_id = ?";
        await db.query(sql, [productId]);
        return res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
        console.error("Database error during deletion:", err);
        return res.status(500).json({ message: "Database Error" });
    }
});

//================ Farmer View All Products =================//

app.get("/products", async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const offset = (page - 1) * limit;

        const countQuery = "SELECT COUNT(*) AS total FROM products";
        const [countResult] = await db.query(countQuery);
        const total = countResult[0].total;
        const totalPages = Math.ceil(total / limit);

        const sql = `
        SELECT *
        FROM products
        ORDER BY product_id DESC
        LIMIT ? OFFSET ?
        `;

        const [products] = await db.query(sql, [limit, offset]);

        res.json({
            data: products,
            total,
            page,
            limit,
            totalPages
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

app.put("/update-product/:id", async (req, res) => {
    const productId = req.params.id;
    const { product_name, category, brand_name, price, quantity, stock_status } = req.body;

    try {
        const sql = `UPDATE products SET 
            product_name = ?, 
            category = ?, 
            brand_name = ?, 
            price = ?, 
            quantity = ?, 
            stock_status = ? 
            WHERE product_id = ?`;

        await db.query(sql, [product_name, category, brand_name, price, quantity, stock_status, productId]);
        return res.status(200).json({ message: "Product updated successfully" });
    } catch (err) {
        console.error("Database error during update:", err);
        return res.status(500).json({ message: "Database Error" });
    }
});

const PORT = process.env.PORT || 5000; // Render assigns its own PORT — hardcoding 5000 breaks live deploys
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});