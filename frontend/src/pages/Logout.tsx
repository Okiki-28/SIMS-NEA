import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/Button"

export const Logout = () => {
    const navigate = useNavigate()
    useEffect(()=>{
        localStorage.removeItem('user')
        localStorage.clear()
        navigate("/")
    }, [navigate])
    return null
}