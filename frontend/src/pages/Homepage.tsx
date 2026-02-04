import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { login } from "../store/authstore";
import { useDispatch } from "react-redux";

export const Home = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    useEffect(() => {

        const fetchStatus = async () => {
            dispatch(login({
                user_id: 1, 
                username: "Samuel"}))
                navigate("/dashboard")
            // try {
            //     const response = await axios.get("http://127.0.0.1:5000/api/auth/status", { withCredentials: true })
            //     console.log(response.data)
            //     if (response.data.loggedIn === true) {
            //         navigate("/dashboard")
            //         dispatch(login({
            //             user_id: response.data.user_id, 
            //             username: response.data.first_name}))
            //     } else {
            //         navigate("/register")
            //     }
            // } catch {
            //     console.log("Error")
            // }
        }
        fetchStatus()
    }, [])
    return (
        <main className="homepage">
            <h1>Home page</h1>
            <h2>Finished Pages</h2>
            <Link to="/login">Login Page</Link>
            <Link to="/register">Registration Page</Link>
            <Link to="/register-existing">Registration of Existing Page</Link>
            <Link to="/register-new">Registration of New Page</Link>
            <h2>Pages in Progress</h2>
            <h2>Pages not yet started</h2>
        </main>
    )
}