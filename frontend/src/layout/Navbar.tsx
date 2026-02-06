import { Button } from "../components/Button";
import React, { useState } from "react";
import { Modal } from "../components/Modal";
import { useSelector } from "react-redux";
import axios from "axios";


export const Navbar = () => {

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const savedUser = localStorage.getItem('user')
    let user 
    let company_reg
    if (savedUser) {   
        user = JSON.parse(savedUser)['username']
        company_reg = JSON.parse(savedUser)['company_reg']
    }
    let pageHeading = useSelector((state: any) => state.heading.value.heading)
    const closeModal = () => {
        setIsActive(false)
    }

    const [isActive, setIsActive] = useState(false)
    const [modalHeading, setModalHeading] = useState("")
    const [modalData, setModalData] = useState({})
    const [isModalForm, setIsModalForm] = useState(false)
    const addProduct = () => {
        setModalHeading("Add")
        const data = {
            "name": "",
            "description": "",
            "quantity": 0,
            "price": 0,
            "reorder_level": 0,
            "supplier": -1,
            "category": -1
        }
        setModalData(data)
        setIsModalForm(true)
        setIsActive(true);
    }

    const handleAddProduct = async (e: React.FormEvent, formData: any) => {
        // e.preventDefault();
        setError("")
        setIsLoading(true)
        console.log(formData)
        try {
            console.log(formData)
            const response = await axios.post(`http://127.0.0.1:5000/api/products/add`, formData, { withCredentials: true });
            const data = response.data
            console.log(data)
        } catch {
            console.log("Error adding product")
        }
    }
    return (
        <>
        <Modal heading={modalHeading} isActive={isActive} isModalForm={isModalForm} data={modalData} handleSubmit={handleAddProduct} onClose={closeModal}  />
        <section className="top-bar">
            <div className="greeting">
                <h1>{pageHeading}</h1>
                <p>Welcome {user}, Manage your stock inventory here</p> 
            </div>
            <div className="functionality">
                <Button onclick={addProduct}>Add Products +</Button>
            </div>
        </section>
        </>
    )
};