import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setHeading } from "../store/authstore";
import { Button } from "../components/Button";

export const Reports = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    useEffect(() => {
        dispatch(setHeading({
            heading: "Reports"
        }));
    }, [dispatch]);
    const savedUser = localStorage.getItem('user')
    let company_reg = ""
    let user_id= ""
    if (savedUser) {
        company_reg = JSON.parse(savedUser)['company_reg']
        user_id = JSON.parse(savedUser)['user_id']
    }

    return (
        <main className="main-layout reports">
            <Button>Generate Report</Button>
        </main>
    )
}