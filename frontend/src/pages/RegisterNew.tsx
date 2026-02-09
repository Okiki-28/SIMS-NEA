import { Button } from "../components/Button";
import { ButtonType } from "../components/Button";
import { Link } from "react-router-dom";

import axios from "axios";
import { useState, } from "react";

import { useNavigate } from "react-router-dom";


// Stay open
export const RegisterNew = () => {

    const navigate = useNavigate()
    const BASE_URL = "http://127.0.0.1:5000/api/auth"

    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const [formData, setFormData] = useState({
        company_name: "",
        company_address: "",
        company_tel: "",
        company_tax: "",
        user_first_name: "",
        user_last_name: "",
        user_role: "Admin",
        user_email: "",
        user_tel: "",
        user_password: "",
        user_confirm_password: "",
        security_question: "",
        security_response: ""
    })

    const handleChange = (e: any) => {
        const { name, value } = e.target

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("")
        setIsLoading(true)
        try {
            axios.post(BASE_URL+"/register-new", formData)
            navigate("/login")
        } catch(err:any) {
            console.log("Login error:", err?.response?.status);
            console.log("Error details:", err?.response?.data);
        }
    }

    return (
        <main>
            <section className="standalone register new">
                <div className="greeting">
                    <h1>Register</h1>
                    <p>Register with <em>New</em> company</p>
                </div>
                <form onSubmit={handleSubmit}>
                    {error && <div className="error-message">{error}</div>}
                    <fieldset>
                        <legend>Company Details</legend>
                        <div>
                            <label htmlFor="company_name">Company Name: </label>
                            <input type="text" id="company_name" name="company_name" onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="company_address">Company Address: </label>
                            <input type="text" id="company_address" name="company_address" onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="company_tel">Company Telephone No.: </label>
                            <input type="tel" id="company_tel" name="company_tel" onChange={handleChange} />
                            
                        </div>
                        <div>
                            <label htmlFor="company_tax">Company Tax Id: </label>
                            <input type="text" id="company_tax" name="company_tax" onChange={handleChange} />
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend>User Details</legend>
                        <div>
                            <label htmlFor="user_first_name">First Name: </label>
                            <input type="text" id="user_first_name" name="user_first_name" onChange={handleChange} placeholder="John"/>
                        </div>
                        <div>
                            <label htmlFor="user_last_name">Last Name: </label>
                            <input type="text" id="user_last_name" name="user_last_name" onChange={handleChange} placeholder="Doe"/>
                        </div>
                        <div>
                            <label htmlFor="user_role">Role: </label>
                            <input type="text" id="user_role" name="user_role" onChange={handleChange} value="Admin" readOnly />
                        </div>
                        <div>
                            <label htmlFor="user_email">Email Address: </label>
                            <input type="email" id="user_email" name="user_email" onChange={handleChange} placeholder="johndoe@company.com"/>
                        </div>
                        <div>
                            <label htmlFor="user_tel">Telephone No.: </label>
                            <input type="tel" id="user_tel" name="user_tel" onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="user_password">Password: </label>
                            <input type="password" id="user_password" name="user_password" onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="user_confirm_password">Confirm Password: </label>
                            <input type="password" id="user_confirm_password" name="user_confirm_password" onChange={handleChange} />
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend>Security Question</legend>
                        <div>
                            <label htmlFor="security_question">Question: </label>
                            <select id="security_question" name="security_question" onChange={handleChange}>
                                <option value="" disabled selected>--Choose a security question--</option>
                                <option value="mother_maiden">What is the your mother's maiden name?</option>
                                <option value="first_pet">What is the name of your first pet?</option>
                                <option value="first_school">What is the name of your first_school?</option>
                            </select>
                            <div>
                                <label htmlFor="security_response">Answer: </label>
                                <input type="text" id="security_response" name="security_response" onChange={handleChange} />
                            </div>
                        </div>
                    </fieldset>
                    <Button type={ButtonType.submit}>
                        {isLoading ? "Registering..." : "Submit"}
                    </Button>
                </form>
                <Link to="/login" className="reg-login">Already have an account?</Link>
            </section>
        </main>
    )
}