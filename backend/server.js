require('dotenv').config();
// Developed by Yash Auti - KrushiLink Project 2026
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');
const transporter = require('./mailer');


const multer = require("multer");
const path = require("path");
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false
    }
}).promise();
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false
    }
}).promise();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root@123",
    database: "krushilink",
    //   port: 3307
}).promise();

console.log("database connected");

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, "uploads");

    },

    filename: function (req, file, cb) {

        cb(null, Date.now() + path.extname(file.originalname));

    }

});

const upload = multer({

    storage: storage

});

app.post('/register', async (req, res) => {
    try {
        console.log("Request body:", req.body);

        const { full_name, name, email, phone, password, role } = req.body;
        const userName = full_name || name;
        const allowedRoles = ["Farmer", "ShopOwner"];
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

        // const hashedPassword = await bcrypt.hash(password, 16);
        const hashedPassword = await bcrypt.hash(password, 10); // Use 10 rounds for better security

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

        // Uploaded Image
        const image = req.file ? req.file.filename : null;

        const stock_status =
            Number(quantity) > 0 ? "In Stock" : "Out of Stock";

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
// app.post("/bulk-upload", async (req, res) => {
//     const { owner_id, category, products } = req.body;

//     if (!owner_id || !category || !products || products.length === 0) {
//         return res.status(400).json({ message: "Invalid payload or empty file." });
//     }

//     try {
//         const values = products.map((item) => [
//             owner_id,
//             item.product_name || "",
//             category,// Forces selected category (Fertilizer, Seed, or Pesticide)
//             item.brand_name || "",
//             item.description || "",
//             item.price || 0,
//             item.quantity || 0,
//             item.unit || "",
//             item.shop_name || "",
//             item.address || "",
//             item.contact_number || "",
//             item.stock_status || "In Stock"
//         ]);

//         const sql = `
//       INSERT INTO products 
//       (owner_id, product_name, category, brand_name, description, price, quantity, unit, shop_name, address, contact_number, stock_status) 
//       VALUES ?
//     `;

//         db.query(sql, [values], (err, result) => {
//             if (err) {
//                 console.error("Database Insert Error:", err);
//                 return res.status(500).json({ message: "Database insertion failed." });
//             }
//             return res.status(200).json({
//                 message: `${result.affectedRows} ${category} products uploaded successfully!`
//             });
//         });
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ message: "Internal server error." });
//     }
// });

app.post("/bulk-upload", async (req, res) => {
    // 1. Remove 'category' from top-level destructuring
    const { owner_id, products } = req.body;

    // 2. Remove '!category' check
    if (!owner_id || !products || products.length === 0) {
        return res.status(400).json({ message: "Invalid payload or empty file." });
    }

    try {
        const values = products.map((item) => [
            owner_id,
            item.product_name || "",
            item.category || "", // <-- Read category directly from Excel row item
            item.brand_name || "",
            item.description || "",
            item.image || null, // <-- Optional: Handle image if included in Excel
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

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
// Delete Product API Route

app.delete("/delete-product/:id", (req, res) => {
    const productId = req.params.id;

    const sql = "DELETE FROM products WHERE product_id = ?";
    db.query(sql, [productId], (err, result) => {
        if (err) {
            console.error("Database error during deletion:", err);
            return res.status(500).json({ message: "Database Error" });
        }
        return res.status(200).json({ message: "Product deleted successfully" });
    });
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

        const [products] = await db.query(sql, [

            limit,
            offset

        ]);

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
app.put("/update-product/:id", (req, res) => {
    const productId = req.params.id;
    const { product_name, category, brand_name, price, quantity, stock_status } = req.body;

    const sql = `UPDATE products SET 
        product_name = ?, 
        category = ?, 
        brand_name = ?, 
        price = ?, 
        quantity = ?, 
        stock_status = ? 
        WHERE product_id = ?`;

    db.query(sql, [product_name, category, brand_name, price, quantity, stock_status, productId], (err, result) => {
        if (err) {
            console.error("Database error during update:", err);
            return res.status(500).json({ message: "Database Error" });
        }
        return res.status(200).json({ message: "Product updated successfully" });
    });
});
