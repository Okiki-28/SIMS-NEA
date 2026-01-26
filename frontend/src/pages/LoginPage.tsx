import { Button } from "../components/Button";
import { Link } from "react-router-dom";

export const Login = () => {
    return (
        <main>
            <section className="login standalone">
                <div className="greeting">
                    <h1>Login</h1>
                    <p>Login to your account</p>
                </div>
                <form action="">
                    <label htmlFor="login-email">Email: </label>
                    <input type="text" id="login-email" placeholder="johndoe@company.com"/>

                    <label htmlFor="login-password">Password: </label>
                    <input type="password" name="login-password" id="login-password" />

                    <Button>Submit</Button>
                </form>
                <Link to="/register" className="login-reg">Create an account</Link>
            </section>
        </main>
    )
}