import { Button } from "../components/Button";
import { Link } from "react-router-dom";
import { ButtonType } from "../components/Button";
import { useNavigate } from "react-router-dom";

import { useState } from "react";

import { useDispatch } from "react-redux";
import { login } from "../store/store";
import api from "../api/client";

export const Login = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e: any) => {
        const { name, value } = e.target

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (error) setError("")
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("")
        setIsLoading(true)

        try {
            console.log(123)
            const response = await api.post("/api/auth/login", formData);
            const data = response.data
            console.log(response.data)
            localStorage.clear()
            localStorage.setItem('user', JSON.stringify(data))
            console.log("Login successful:", data);
            console.log(data)
            
            dispatch(login({
                user_id: data.user_id, 
                username: data.username,
                company_reg_no: data.company_reg_no
            }))
            
            navigate("/dashboard")
            
        } catch (err: any) {
            console.log("Login error:", err?.response?.status);
            console.log("Error details:", err?.response?.data);
            
            // Set user-friendly error message
            if (err?.response?.status === 401) {
                setError("Invalid email or password")
            } else if (err?.response?.data?.message) {
                setError(err.response.data.message)
            } else {
                setError("Login failed. Please try again.")
            }
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <main className="standalone-main">
            <section className="login standalone">
                <div className="greeting">
                    <h1>Login</h1>
                    <p>Login to your account</p>
                </div>
                <form onSubmit={handleSubmit}>
                    {error && <div className="error-message">{error}</div>}
                    
                    <label htmlFor="email">Email: </label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        placeholder="johndoe@company.com" 
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                    />

                    <label htmlFor="password">Password: </label>
                    <input 
                        type="password" 
                        name="password" 
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                    />

                    <Button type={ButtonType.submit}>
                        {isLoading ? "Logging in..." : "Submit"}
                    </Button>
                </form>
                <Link to="/register" className="login-reg">Create an account</Link>
            </section>
        </main>
    )
}