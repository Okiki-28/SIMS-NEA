import { useState } from "react"
import axios from "axios"
import { Button } from "../components/Button"
import { ButtonType } from "../components/Button"
import { useNavigate } from "react-router-dom"

export const RegisterExisting = () => {

    const navigate = useNavigate()
    const BASE_URL = "http://127.0.0.1:5000/api/auth"

    const [formData, setFormData] = useState({
        company_reg_no: "",
        user_first_name: "",
        user_last_name: "",
        user_role: "Admin",
        user_email: "",
        user_tel: "",
        user_password: "",
        user_confirm_password: ""
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
            const response = await axios.post(`${BASE_URL}/register-existing`, formData);
            const data= response.data
            console.log("OK:", data);
            navigate("/login")
        } catch (err: any) {
            console.log("Status:", err?.response?.status);
        }
    };

    return (
        <main>
            <section className="standalone register existing">
                <div className="greeting">
                    <h1>Register</h1>
                    <p>Register with <em>Existing</em> Company</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="company_reg_no">Company Reg No</label>
                        <input type="text" id="company_reg_no" name="company_reg_no" onChange={handleChange} />
                    </div>
                    <div>
                        <label htmlFor="user_first_name">Full Name: </label>
                        <input type="text" id="user_first_name" name="user_first_name" onChange={handleChange} placeholder="John"/>
                    </div>
                    <div>
                        <label htmlFor="user_last_name">Full Name: </label>
                        <input type="text" id="user_last_name" name="user_last_name" onChange={handleChange} placeholder="Doe"/>
                    </div>
                    {/* Add dropdown menu here */}
                    <div>
                        <label htmlFor="user_role">Role: </label>
                        <select name="user_role" id="user_role" onChange={handleChange}>
                            <option value="">--Select Role--</option>
                            <option value="admin">Admin</option>
                            <option value="staff">Staff</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="user_email">Email</label>
                        <input type="email" id="user_email" name="user_email" onChange={handleChange} placeholder="johndoe@gmail.com"/>
                    </div>
                    <div>
                        <label htmlFor="user_tel">Telephone No.: </label>
                        <input type="tel" id="user_tel" name="user_tel" onChange={handleChange} />
                    </div>
                    <div>
                        <label htmlFor="user_password">Password</label>
                        <input type="password" id="user_password" name="user_password" onChange={handleChange}/>
                    </div>
                    <div>
                        <label htmlFor="user_confirm_password">Confirm Password: </label>
                        <input type="password" id="user_confirm_password" name="user_confirm_password" onChange={handleChange} />
                    </div>
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
                    <Button type={ButtonType.submit}>Submit</Button>
                </form>
            </section>
        </main>
    )
}