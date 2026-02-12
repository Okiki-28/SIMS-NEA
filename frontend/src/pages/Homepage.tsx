import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { login } from "../store/store";
import { useDispatch } from "react-redux";

export const Home = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    useEffect(() => {
        const savedUser = localStorage.getItem('user')
        if (savedUser) {
            const user = JSON.parse(savedUser)
            navigate("/dashboard")
        } else {
            navigate("/register")
        }
    })
    return (
        <></>
        // <main className="homepage">
        //     <h1>Home page</h1>
        //     <h2>Finished Pages</h2>
        //     <Link to="/login">Login Page</Link>
        //     <Link to="/register">Registration Page</Link>
        //     <Link to="/register-existing">Registration of Existing Page</Link>
        //     <Link to="/register-new">Registration of New Page</Link>
        //     <h2>Pages in Progress</h2>
        //     <h2>Pages not yet started</h2>
        // </main>
    )
}