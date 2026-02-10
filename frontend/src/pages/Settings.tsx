import { useDispatch } from "react-redux";
import { setHeading } from "../store/store";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import { Button } from "../components/Button";
import axios from "axios";


export const Settings = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    useEffect(() => {
        dispatch(setHeading({
            heading: "Settings",
            message: "Edit your profile and company settings here"
        }));
    }, [dispatch]);
    const company_reg_no = useMemo(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser).company_reg_no : "";
    }, []);
    const user_id = useMemo(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser).user_id : "";
    }, []);

    const [isDisabled, setisDisabled] = useState(true)
    const [userDetails, setUserDetails] = useState({
        user_id: user_id,
        company_name: "",
        company_address: "",
        company_tel: "",
        company_tax: "",
        company_size: 0,
        company_reg_no: company_reg_no,
        company_threshold: 0,
        company_report_time_period: 1,
        user_first_name: "",
        user_last_name: "",
        user_role: "",
        user_email: "",
        user_tel: "",
        user_password: ""
    })
    useEffect(() => {
        const payload = {
            "user_id": user_id,
            "company_reg_no": company_reg_no
        }
        
        const fetchDetails = async () => {
            try {
                const [userResponse, companyResponse] = await Promise.all([
                    axios.post("http://127.0.0.1:5000/api/users", payload),
                    axios.post("http://127.0.0.1:5000/api/companies", payload)
                ]);
                
                console.log(userResponse.data, companyResponse.data);
                
                // Merge both responses but keep user_password as empty string
                setUserDetails(prev => ({
                    ...prev,
                    ...userResponse.data,
                    ...companyResponse.data,
                    user_password: ""  // ← Explicitly keep this empty
                }));
            } catch (error) {
                console.log("Unable to fetch details", error);
            }
        }
        
        fetchDetails();
    }, [user_id, company_reg_no]);

    const handleChange = (e: any) => {
        const { name, value } = e.target

        setUserDetails(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const saveDetails = async (formData: any) => {
        console.log(formData)

        try {
            const response = await axios.post(`http://127.0.0.1:5000/api/users/edit`, formData, { withCredentials: true });
            const data = response.data
            console.log(data)
            alert()
            navigate(0)
            return data
        } catch {
            console.log("Error editing this product")
            return {}
        }
    }

    return (
        <main className="main-layout settings">
            <div className="personal-info">
                <div className="header">
                    <h1>Personal Information</h1>
                </div>
                <form>
                    <div>
                        <label htmlFor="user_first_name">First Name: </label>
                        <input type="text" id="user_first_name" name="user_first_name" onChange={handleChange} value={userDetails.user_first_name} disabled={isDisabled}/>
                    </div>
                    <div>
                        <label htmlFor="user_last_name">Last Name: </label>
                        <input type="text" id="user_last_name" name="user_last_name" onChange={handleChange} value={userDetails.user_last_name} disabled={isDisabled}/>
                    </div>
                    <div>
                        <label htmlFor="user_role">Role: </label>
                        <select name="user_role" id="user_role" onChange={handleChange} value={userDetails.user_role} disabled={isDisabled}>
                            <option value="">--Select Role--</option>
                            <option value="admin">Admin</option>
                            <option value="staff">Staff</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="user_email">Email Address: </label>
                        <input type="email" id="user_email" name="user_email" onChange={handleChange} value={userDetails.user_email} disabled={isDisabled}/>
                    </div>
                    <div>
                        <label htmlFor="user_tel">Telephone No.: </label>
                        <input type="tel" id="user_tel" name="user_tel" onChange={handleChange} value={userDetails.user_tel}  disabled={isDisabled}/>
                    </div>
                    {!isDisabled && 
                    <div>
                        <label htmlFor="user_password">Password: </label>
                        <input type="password" id="user_password" name="user_password" value={userDetails.user_password} placeholder="Change password" onChange={handleChange} />
                    </div>}
                </form>
            </div>
            <div className="company-info">
                <div className="header">
                    <h1>Company Information</h1>
                </div>
            </div>
                <form>
                    <div>
                        <label htmlFor="company_Reg_no">Company Name: </label>
                        <input type="text" id="company_Reg_no" name="company_Reg_no" onChange={handleChange} value={company_reg_no} disabled={isDisabled}/>
                    </div>
                    <div>
                        <label htmlFor="company_name">Company Name: </label>
                        <input type="text" id="company_name" name="company_name" onChange={handleChange} value={userDetails.company_name} disabled={isDisabled}/>
                    </div>
                    <div>
                        <label htmlFor="company_address">Company Address: </label>
                        <input type="text" id="company_address" name="company_address" onChange={handleChange} value={userDetails.company_address} disabled={isDisabled}/>
                    </div>
                    <div>
                        <label htmlFor="company_tel">Company Telephone: </label>
                        <input type="text" id="company_tel" name="company_tel" onChange={handleChange} value={userDetails.company_tel}  disabled={isDisabled}/>
                    </div>
                    <div>
                        <label htmlFor="company_tax">Company Tax: </label>
                        <input type="email" id="company_tax" name="company_tax" onChange={handleChange} value={userDetails.company_tax} disabled={isDisabled}/>
                    </div>
                    <div>
                        <label htmlFor="company_size">Company Size: </label>
                        <input type="tel" id="company_size" name="company_size" onChange={handleChange} value={userDetails.company_size}  disabled={isDisabled}/>
                    </div>
                    <div>
                        <label htmlFor="company_threshold">Company Threshold: </label>
                        <input type="tel" id="company_threshold" name="company_threshold" onChange={handleChange} value={userDetails.company_threshold}  disabled={isDisabled}/>
                    </div>
                    <div>
                        <label htmlFor="company_report_time_period">Report Time: </label>
                        <select name="company_report_time_period" id="company_report_time_period" onChange={handleChange} value={userDetails.company_report_time_period} disabled={isDisabled}>
                            <option value="7">7 days</option>
                            <option value="14">14 days</option>
                            <option value="30">30 days</option>
                            <option value="60">60 days</option>
                            <option value="90">90 days</option>
                            <option value="180">6 Months</option>
                            <option value="365">1 Year</option>
                            <option value="3650">All time</option> {/* 10 years */}
                        </select>
                    </div>
                </form>
            {
            isDisabled? 
            <Button onclick={()=>{setisDisabled(false)}}>Edit Details</Button>: 
            <div>
            <Button onclick={() => saveDetails(userDetails)}>Save</Button>
            <Button onclick={()=>{setisDisabled(true); navigate(0)}}>Cancel</Button>
            </div>
            }
        </main>
    )
}