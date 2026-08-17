// export default Register;
import axios from "axios";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // 1. Link import 
import './Auth.css';

function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [role, setRole] = useState("Farmer");

    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const validate = () => {
        let newErrors = {};

        if (name.trim() === "") {
            newErrors.name = "Name is required";
        }

        if (email === "") {
            newErrors.email = "Email is required";
        }
        else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Invalid email";
        }

        if (password === "") {
            newErrors.password = "Password is required";
        }
        else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (phone.trim() === "") {
            newErrors.phone = "Phone is required";
        }
        else if (!/^[0-9]{10}$/.test(phone)) {
            newErrors.phone = "Phone must be 10 digits";
        }

        if (!role) {
            newErrors.role = "Role is required";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const register = (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        axios.post("http://localhost:5000/register", {
            full_name: name,
            email,
            phone,
            password,
            role
        })
        .then((res) => {
            alert(res?.data?.message || "Registration Successful");
            navigate("/login");
        })
        .catch((err) => {
            alert(err?.response?.data?.message || "Registration failed");
        });
    }

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={register}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <p style={{ color: "red" }}>{errors.name}</p>

                {/* Email Input */}
                <input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="off"
                />
                <p style={{ color: "red" }}>{errors.email}</p>  

                {/* Password Input */}
                <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                />
                <p style={{ color: "red" }}>{errors.password}</p>

                <input
                    type="tel"
                    placeholder="Enter Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
                <p style={{ color: "red" }}>{errors.phone}</p>

                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option value="Farmer">Farmer</option>
                    <option value="ShopOwner">Shop Owner</option>
                </select>
                <p style={{ color: "red" }}>{errors.role}</p>

                <button type="submit">
                    Register
                </button>

                {/* 2. Login Link Option */}
                <p style={{ marginTop: "15px", textAlign: "center", fontSize: "14px", color: "#555" }}>
                    Already have an account?{" "}
                    <Link to="/login" style={{ color: "#007bff", fontWeight: "bold", textDecoration: "none" }}>
                        Login
                    </Link>
                </p>

            </form>
        </div>
    );
}

export default Register;