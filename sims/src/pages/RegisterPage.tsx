import { Link } from "react-router-dom"

export const Register = () => {
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