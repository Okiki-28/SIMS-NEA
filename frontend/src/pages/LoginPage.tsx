import { Button } from "../components/Button";
import { Link } from "react-router-dom";
import { ButtonType } from "../components/Button";
import { useNavigate } from "react-router-dom";

import { useState } from "react";
import axios from "axios";

export const Login = () => {

    const BASE_URL = "http://127.0.0.1:5000/api/auth"

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const handleChange = (e: any) => {
        const { name, value } = e.target

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await axios.post(`${BASE_URL}/login`, formData, { withCredentials: true });
            console.log("OK:", res.data);
            navigate("/")
            
        } catch (err: any) {
            console.log("Status:", err?.response?.status);
            console.log("Backend:", err?.response?.data);
            
        }
    };

    return (
        <main>
            <section className="login standalone">
                <div className="greeting">
                    <h1>Login</h1>
                    <p>Login to your account</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">Email: </label>
                    <input type="text" id="email" name="email" placeholder="johndoe@company.com" onChange={handleChange}/>

                    <label htmlFor="password">Password: </label>
                    <input type="password" name="password" id="password" onChange={handleChange}/>

                    <Button type={ButtonType.submit}>Submit</Button>
                </form>
                <Link to="/register" className="login-reg">Create an account</Link>
            </section>
        </main>
    )
}