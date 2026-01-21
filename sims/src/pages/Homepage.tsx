import { Link } from "react-router-dom";

export const Home = () => {
    return (
        <main className="homepage">
            <h1>Home page</h1>
            <h2>Finished Pages</h2>
            <Link to="/login">Login Page</Link>
            <Link to="/Register">Registration Page</Link>
            <Link to="/register-existing">Registration of Existing Page</Link>
            <Link to="/register-new">Registration of New Page</Link>
            <h2>Pages in Progress</h2>
            <h2>Pages not yet started</h2>
        </main>
    )
}