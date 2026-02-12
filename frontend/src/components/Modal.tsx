import { Button, ButtonType } from "./Button"
import React, { useEffect, useMemo, useState } from "react"
import api from "../api/client"

export const Modal = ({heading="Modal", purpose="product", data, isActive, onClose, isModalForm, handleSubmit}: any) => {
    
    const [all_suppliers, setAll_suppliers] = useState([{
            "id": -1,
            "name": "",
            "no_of_products": -1
        }])
    const [all_categories, setAll_categories] = useState([{
            "id": -1,
            "name": "",
            "no_of_products": -1
        }])
    const company_reg_no = useMemo(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser).company_reg_no : "";
    }, []);
    const user_id = useMemo(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser).user_id : "";
    }, []);
    const [addProductFormData, setAddProductFormData] = useState({
        "user_id": user_id,
        "id": data['id'],
        "name": data['name'],
        "description": data['description'],
        "quantity": data['quantity'],
        "reorder_level": data['reorder_level'],
        "price": data['price'],
        "supplier": data['supplier'],
        "category": data['category'],
        "category_id": data['category_id'],
        "supplier_id": data['supplier_id'],
        "company_reg_no": company_reg_no
    })
    useEffect(() => {
    if (!isActive || purpose !== "product") return;

    setAddProductFormData({
        user_id: user_id,
        id: data?.id ?? 0,
        name: data?.name ?? "",
        description: data?.description ?? "",
        quantity: data?.quantity ?? 0,
        reorder_level: data?.reorder_level ?? 0,
        price: data?.price ?? 0,
        supplier: data?.supplier ?? "",   // handles id or name
        category: data?.category ?? "",   // handles id or name
        category_id: data?.category_id ?? "",
        supplier_id: data?.supplier_id ?? "",
        company_reg_no: company_reg_no,
    });
    }, [data, isActive, purpose, company_reg_no]);
    const [addCategoryFormData, setAddCategoryFormData] = useState({
        "name": data['name'],
        "company_reg_no": company_reg_no,
        "user_id": "user_id"
    })
    useEffect(() => {
    if (!isActive || purpose !== "category") return;

    setAddCategoryFormData({
        name: data?.name ?? "",
        company_reg_no: company_reg_no,
        user_id: user_id
    });
    }, [data, isActive, purpose, company_reg_no]);

    const [addSupplierFormData, setAddSupplierFormData] = useState({
        "name": data['name'],
        "email": data['email'],
        "address": data['address'],
        "phone": data['phone'],
        "company_reg_no": company_reg_no,
        "user_id": user_id
    })
    useEffect(() => {
    if (!isActive || purpose !== "supplier") return;

    setAddSupplierFormData({
        name: data?.name ?? "",
        email: data?.email ?? "",
        address: data?.address ?? "",
        phone: data?.phone ?? "",
        company_reg_no: company_reg_no,
        user_id: user_id
    });
    }, [data, isActive, purpose, company_reg_no]);
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() =>{
        const fetchCategories = async () => {
            try {
                const data = {
                    "user_id": user_id,
                    "company_reg_no": company_reg_no
                }
                const response = await api.post("/api/categories", data)
                setAll_categories(response.data)
            } catch {
                console.log("Failed to fetch Categories error")
            }
        }
        const fetchSuppliers = async () => {
            try {
                const data = {
                    "user_id": user_id,
                    "company_reg_no": company_reg_no
                }
                const response = await api.post("/api/suppliers", data)
                setAll_suppliers(response.data)
            } catch {
                console.log("Failed to fetch Categories error")
            }
        }
    fetchSuppliers();
    fetchCategories();
    }, [company_reg_no])

    const handleProductSummit = (e: React.FormEvent) => {
        // e.preventDefault()
        console.log(addProductFormData)
        handleSubmit(e, addProductFormData)
        setAddProductFormData({
            "user_id": user_id,
            "id": 0,
            "name": "",
            "description": "",
            "quantity": 0,
            "reorder_level": 0,
            "price": 0,
            "supplier": "",
            "category": "",
            "company_reg_no": company_reg_no,
            "category_id": 0,
            "supplier_id": 0
        })
        onClose()
    }
    
    const handleCategorySubmit = (e: React.FormEvent) => {
        // e.preventDefault()
        console.log("category form data:", addCategoryFormData)
        console.log("here")
        handleSubmit(e, addCategoryFormData)
        setAddCategoryFormData({
            "name": "",
            "company_reg_no": company_reg_no,
            "user_id": user_id
        })
        onClose()
    }
    
    const handleSupplierSubmit = (e: React.FormEvent) => {
        // e.preventDefault()
        
        console.log(addSupplierFormData)
        handleSubmit(e, addSupplierFormData)
        setAddSupplierFormData({
            "name": "",
            "email": "",
            "address": "",
            "phone": "",
            "company_reg_no": company_reg_no,
            "user_id": user_id
        })
        onClose()
    }

    const handleProductChange = (e: any) => {
        const { name, value } = e.target

        setAddProductFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (error) setError("")
    }

    const handleCategoryChange = (e: any) => {
        const { name, value } = e.target

        setAddCategoryFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (error) setError("")
    }

    const handleSupplierChange = (e: any) => {
        const { name, value } = e.target

        setAddSupplierFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (error) setError("")
    }
    console.log(addProductFormData.category_id)
    let x = 2;
    return (
        <div className={isActive? "modal active": "modal"}>
            <div className="box">
                <h1>{heading} Product</h1>
                <Button onclick={onClose} className="cancel">X</Button>
                {purpose == "product" &&
                <form onSubmit={handleProductSummit}>
                    {isModalForm? (
                        <>
                        <div>
                            <label htmlFor="name">Name :</label>
                            <input type="text" name="name" id="name" value={addProductFormData.name} onChange={handleProductChange} />
                        </div>
                        <div>
                            <label htmlFor="description">Description :</label>
                            <input type="text" name="description" id="description" value={addProductFormData.description} onChange={handleProductChange} />
                        </div>
                        <div>
                            <label htmlFor="quantity">Quantity :</label>
                            <input type="number" name="quantity" id="quantity" value={addProductFormData.quantity} onChange={handleProductChange} />
                        </div>
                        <div>
                            <label htmlFor="price">Price :</label>
                            <input type="number" name="price" id="price" value={addProductFormData.price} onChange={handleProductChange} />
                        </div>
                        <div>
                            <label htmlFor="reorder_level">Reorder Level :</label>
                            <input type="number" name="reorder_level" id="reorder_level" value={addProductFormData.reorder_level} onChange={handleProductChange} />
                        </div>
                        <label htmlFor="category"></label>
                        <div>
                            <label htmlFor="category">Category : </label>
                            
                            <select name="category_id" id="category" onChange={handleProductChange} value={addProductFormData.category_id} >
                                <option value="">--Select Category--</option>
                                {all_categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="supplier">Supplier : </label>
                            <select name="supplier_id" id="supplier" onChange={handleProductChange} value={addProductFormData.supplier_id}>
                                <option value="">--Select Supplier--</option>
                                {all_suppliers.map(supplier => (
                                    <option key={supplier.id} value={supplier.id}>
                                        {supplier.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        </>
                    ): Object.entries(data).filter(([name]) => !["id", "supplier_id", "category_id"].includes(name)).map(([name, value=""]:any) => (
                        <div key={name} className="view-prod">
                            <h3>{name.charAt(0).toUpperCase() + name.slice(1)} :</h3>
                            <h4 className="product-value">{value}</h4>
                        </div>
                    ))}
                    {isModalForm && <Button type={ButtonType.submit}>{heading}</Button> }
                    
                </form>}
                {purpose == "category" && (
                    <form onSubmit={handleCategorySubmit}>
                        <>
                        <div>
                            <label htmlFor="name">Name :</label>
                            <input type="text" name="name" id="name" value={addCategoryFormData.name} onChange={handleCategoryChange} />
                        </div>
                        </>
                        {isModalForm && <Button type={ButtonType.submit}>{heading}</Button> }
                    </form>
                )}
                {purpose == "supplier" && (
                    <form onSubmit={handleSupplierSubmit}>
                        <>
                        <div>
                            <label htmlFor="name">Name :</label>
                            <input type="text" name="name" id="name" value={addSupplierFormData.name} onChange={handleSupplierChange} />
                        </div>
                        <div>
                            <label htmlFor="email">Email :</label>
                            <input type="text" name="email" id="email" value={addSupplierFormData.email} onChange={handleSupplierChange} />
                        </div>
                        <div>
                            <label htmlFor="address">Address :</label>
                            <input type="text" name="address" id="address" value={addSupplierFormData.address} onChange={handleSupplierChange} />
                        </div>
                        <div>
                            <label htmlFor="phone">Phone :</label>
                            <input type="text" name="phone" id="phone" value={addSupplierFormData.phone} onChange={handleSupplierChange} />
                        </div>
                        </>
                        {isModalForm && <Button type={ButtonType.submit}>{heading}</Button> }
                    </form>
                )}
            </div>
        </div>
    )
}