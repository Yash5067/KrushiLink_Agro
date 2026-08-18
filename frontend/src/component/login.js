import axios from "axios";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import './Auth.css';

export default function Login() {
    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");



    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const validate = () => {
        let newErrors = {};


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

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // ...existing code...
    const login = (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        axios.post("https://krushilink-agro.onrender.com/login", {
            email,
            password
        })
            .then((res) => {
                console.log(res.data);
                sessionStorage.setItem("user_id", res.data.user.user_id);
                sessionStorage.setItem("full_name", res.data.user.full_name);
                sessionStorage.setItem("role", res.data.user.role);

                console.log("role: ", res.data.user.role);

                if (res.data.token) {
                    sessionStorage.setItem("token", res.data.token);
                }

                alert("Login Successful");
                navigate("/home");
            })
            .catch((err) => {
                console.log(err?.response);

                alert(err?.response?.data?.message || "Login failed");
            });
    }

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={login}>
                <input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <p style={{ color: "red" }}>{errors.email}</p>

                <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <p style={{ color: "red" }}>{errors.password}</p>

                <button type="submit">Login</button>
        {/* 2. Login Link Option */}
                <p style={{ marginTop: "15px", textAlign: "center", fontSize: "14px", color: "#555" }}>
                    Don't have an account?{" "}
                    <Link to="/register" style={{ color: "#007bff", fontWeight: "bold", textDecoration: "none" }}>
                        Register
                    </Link>
                </p>
            </form>
           
        </div>
    );

}
