import { useState } from "react"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import api from "../api/client"
import { Button, ButtonType } from "../components/Button"

export const ForgotPassword = () => {
    
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: "",
        security_response: "",
        password: "",
        confirm_password: ""
    })
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [emailResponse, setEmailResponse] = useState(false)
    const [securityQuestion, setSecurityQuestion] = useState("")
    const [securityResponse, setSecurityResponse] = useState(false)


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

        const getAccountInfo = async () => {
            try {
                const response = await api.post("/api/auth/recover/question", formData)
                console.log(response.data)
                setEmailResponse(response.data.status)
                setSecurityQuestion(response.data.security_question)
                return response.data
            } catch {
                console.log("error")
                return {}
            }
        }
        const submitAccountInfo = async () => {
            try {
                const response = await api.post("/api/auth/recover/security", formData)
                console.log(response.data)
                setSecurityResponse(response.data.status)
                return response.data
            } catch {
                return {}
            }
        }
        const changePassword = async () => {
            try {
                const response = await api.post("/api/auth/recover/password", formData)
                console.log(response.data)
                if (response.data.status) {
                    alert("Password changed")
                    navigate("/login")
                    return response.data
                }
            } catch {
                return {}
            }
        }
        if (emailResponse == false) {
            getAccountInfo();
            setIsLoading(false)
        }
        if (emailResponse == true && securityResponse == false) {
            submitAccountInfo();
            setIsLoading(false)
        }
        if (emailResponse == true && securityResponse == true) {
            changePassword();
            setIsLoading(false)
        }
    };

    return (
        <main className="standalone-main">
            <section className="login standalone">
                <div className="greeting">
                    <h1>Account Recovery</h1>
                    <p>Reset password</p>
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

                    {(emailResponse == true && securityResponse == false) && (
                        <>
                        <label htmlFor="security_question">Question: </label>
                        <select id="security_question" name="security_question" value={securityQuestion} disabled onChange={handleChange}>
                                <option value="" disabled>--Choose a security question--</option>
                                <option value="mother_maiden">What is the your mother's maiden name?</option>
                                <option value="first_pet">What is the name of your first pet?</option>
                                <option value="first_school">What is the name of your first school?</option>
                            </select>

                        <label htmlFor="security_response">Security Response</label>
                        <input 
                            type="text" 
                            id="security_response" 
                            name="security_response" 
                            placeholder=""
                            value={formData.security_response}
                            onChange={handleChange}
                            required
                        />
                        </>
                    )}
                    {(emailResponse == true && securityResponse == true) && 
                    <>
                    <label htmlFor="password">Password: </label>
                    <input type="password" id="password" name="password" onChange={handleChange} />

                    <label htmlFor="confirm_password">Confirm Password: </label>
                    <input type="password" id="confirm_password" name="confirm_password" onChange={handleChange} />

                    </>
                    }

                    <Button type={ButtonType.submit}>
                        {isLoading ? "Loading..." : "Submit"}
                    </Button>
                </form>
                <Link to="/login" className="login-reg">Go back</Link>
            </section>
        </main>
    )
}