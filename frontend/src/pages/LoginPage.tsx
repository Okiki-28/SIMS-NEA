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
                    <label htmlFor="email">Email: </label>
                    <input type="text" id="email" placeholder="johndoe@company.com"/>

                    <label htmlFor="password">Password: </label>
                    <input type="password" name="password" id="login-password" />

                    <Button>Submit</Button>
                </form>
                <Link to="/register" className="login-reg">Create an account</Link>
            </section>
        </main>
    )
}