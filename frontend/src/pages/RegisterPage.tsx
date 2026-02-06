import { Link, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { useEffect } from "react"

export const Register = () => {
    const savedUser = localStorage.getItem('user')
    let user_id = 0
    if (savedUser) {
        user_id = JSON.parse(savedUser)['user_id']
    }
    const navigate = useNavigate()
    useEffect(()=>{
        if (user_id !== 0) {
            navigate("/dashboard")
        }
    }, [])
    return (
        <main>
            <section className="standalone">
                <div className="greeting">
                    <h1>Register</h1>
                    <p>Resgister an account</p>
                </div>
                <div className="registration-choice">
                    <Link to="/register-new" className="reg-new solid">Register new Company</Link>
                    <Link to="/register-existing" className="reg-existing solid">Register with Existing Company</Link>
                </div>
                <Link to="/login" className="reg-login">Already have an account?</Link>
            </section>
        </main>
    )
}