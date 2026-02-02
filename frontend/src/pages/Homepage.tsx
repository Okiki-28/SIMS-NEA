import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export const Home = () => {
    const navigate = useNavigate()
    useEffect(() => {

        const fetchStatus = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:5000/api/auth/status", { withCredentials: true })
                console.log("here")
                alert(response.data === true)
                if (response.data === true) {
                    navigate("/dashboard")
                } else {
                    navigate("/register")
                }
            } catch {
                console.log("Error")
            }
        }
        fetchStatus()
    }, [])
    return (
        <main className="homepage">
            <h1>Home page</h1>
            <h2>Finished Pages</h2>
            <Link to="/login">Login Page</Link>
            <Link to="/register">Registration Page</Link>
            <Link to="/register-existing">Registration of Existing Page</Link>
            <Link to="/register-new">Registration of New Page</Link>
            <h2>Pages in Progress</h2>
            <h2>Pages not yet started</h2>
        </main>
    )
}