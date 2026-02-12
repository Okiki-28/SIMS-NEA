import { Button } from "../components/Button";
import React, { useMemo, useState } from "react";
import { Modal } from "../components/Modal";
import { useSelector } from "react-redux";
import api from "../api/client";


export const Navbar = () => {

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const company_reg_no = useMemo(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser).company_reg_no : "";
    }, []);
    const user_id = useMemo(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser).user_id : "";
    }, []);
    const user = useMemo(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser).username : "";
    }, []);
    let pageHeading = useSelector((state: any) => state.heading.value.heading)
    let message = useSelector((state: any) => state.heading.value.message)
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
            const response = await api.post("/api/products/add", formData, { withCredentials: true });
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
                <p>Welcome {user}, {message}</p> 
            </div>
            <div className="functionality">
                <Button onclick={addProduct}>Add Products +</Button>
            </div>
        </section>
        </>
    )
};