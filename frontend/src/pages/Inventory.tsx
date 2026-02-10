import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setHeading } from "../store/store";
import { data, Link, useNavigate } from "react-router-dom";
import { ConfirmDialog } from "../components/ConfirmDialog";

export const Inventory = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    useEffect(() => {
        dispatch(setHeading({
            heading: "Inventory",
            message: "Manage your Stock Inventory here"
        }));
    }, [dispatch]);
    const savedUser = localStorage.getItem('user')
    let company_reg_no = ""
    let user_id= ""
    if (savedUser) {
        company_reg_no = JSON.parse(savedUser)['company_reg_no']
        user_id = JSON.parse(savedUser)['user_id']
    }
    
    const [all_products, setAll_products] = useState([{
        "id": -1,
        "name": "",
        "category": "",
        "quantity": -1,
        "unit_price": 0,
        "supplier": "",
        "status": false,
    }])
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
    const [sortCategory, setSortCategory] = useState("")
    const [sortSupplier, setSortSupplier] = useState("")
    const [search, setSearch] = useState("")
    const [isActive, setIsActive] = useState(false)
    const [modalHeading, setModalHeading] = useState("")
    const [modalData, setModalData] = useState({})
    const [isModalForm, setIsModalForm] = useState(false)
    const [handleSubmit, setHandleSubmit] = useState<any>()
    const [modalPurpose, setModalPurpose] = useState("product")

    const [proceedFunc, setProceedFunc] = useState<any>()
    const [isDialogActive, setIsDialogActive] = useState(false)
    const [dialogMessage, setDialogMessage] = useState("")

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const handleCategoryChange = (e: any) => {
        setSortCategory(e.target.value)
    }
    
    const handleSupplierChange = (e: any) => {
        setSortSupplier(e.target.value)
    }
    
    const handleSearchChange = (e: any) => {
        setSearch(e.target.value)
    }

    const closeModal = () => {
        setIsActive(false)
    }

    const addSupplier = () => {
        setModalHeading("Add Supplier ")
        const data = {
            "email": "",
            "address": "",
            "phone": ""
        }
        setModalData(data)
        setIsModalForm(true)
        setIsActive(true);
        setHandleSubmit(() => handleAddSupplier)
        setModalPurpose("supplier")
    }

    const handleAddSupplier = async (e: React.FormEvent, formData: any) => {
        setError("")
        setIsLoading(true)
        
        console.log("here")
        console.log(formData)
        try {
            console.log(formData)
            const response = await axios.post(`http://127.0.0.1:5000/api/suppliers/add`, formData, { withCredentials: true });
            const data = response.data
            console.log(data)
        } catch {
            console.log("Error adding supplier")
        }
    }

    const addCategory = () => {
        setModalHeading("Add Category ")
        const data = {
            "name": "",
        }
        setModalData(data)
        setIsModalForm(true)
        setIsActive(true);
        setHandleSubmit(() => handleAddCategory)
        setModalPurpose("category")
    }

    const handleAddCategory = async (e: React.FormEvent, formData: any) => {
        setError("")
        setIsLoading(true)
        
        try {
            console.log(formData)
            const response = await axios.post(`http://127.0.0.1:5000/api/categories/add`, formData, { withCredentials: true });
            const data = response.data
            console.log(data)
        } catch {
            console.log("Error adding category")
        }
    }

    const viewProduct = (prod_id: any) => {
        setModalHeading("View")
        const data = {
            "user_id": user_id,
            "company_reg_no": company_reg_no,
            "product_id": prod_id
        }
        const getProductDetails = async () => {
            try {
                const response = await axios.post("http://127.0.0.1:5000/api/products/get", data)
                console.log(response.data)
                setModalData(response.data)
                return response.data
            } catch {
                return {}
            }
        }
        getProductDetails();
        setIsModalForm(false)
        setIsActive(true);
    }

    const deleteProduct = (prod_id: number) => {
        const delProduct = async () => {
            const payload = {
                "user_id": user_id,
                "company_reg_no": company_reg_no
            }
            try {
                const response = await axios.delete(`http://127.0.0.1:5000/api/products/${prod_id}`, {data: payload})
                setIsDialogActive(false)
                navigate(0)
                return response.data
            } catch {
                console.log("Unable to delet product")
                return {}
            }
        }
        setDialogMessage("Do you wish to delete this product? ")
        setIsDialogActive(true)
        setProceedFunc(() => delProduct)
    }

    const editProduct = (prod_id: number) => {
        setModalHeading("Edit")
        const data = {
            "user_id": user_id,
            "product_id": prod_id,
            "company_reg_no": company_reg_no
        }
        const getProductDetails = async () => {
            try {
                const response = await axios.post("http://127.0.0.1:5000/api/products/get", data);
                console.log(response.data, "meee")
                setModalData(response.data)
                return response.data
            } catch {
                return {}
            }
        }
        getProductDetails();
        setIsModalForm(true)
        setHandleSubmit(() => handleEditProduct)
        setIsActive(true);
    }


    const handleEditProduct = async (e: React.FormEvent, formData: any) => {
        // e.preventDefault();
        setError("")
        setIsLoading(true)
        
        try {
            console.log(formData)
            const response = await axios.post(`http://127.0.0.1:5000/api/products/edit`, formData, { withCredentials: true });
            const data = response.data
            setError(data)
            console.log(data)
        } catch {
            console.log(error)
            console.log("Error editing this product")
        }
    }

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = {
                    "company_reg_no": company_reg_no,
                    "user_id": user_id
                }
                const response = await axios.post("http://127.0.0.1:5000/api/products/get-all", data)
                console.log(response.data, company_reg_no)
                setAll_products(response.data)
            } catch {
                console.log("Error")
            }
        }
        const fetchSuppliers = async () => {
            try {
                const data = {
                    "company_reg_no": company_reg_no,
                    "user_id": user_id
                }
                const response = await axios.post("http://127.0.0.1:5000/api/suppliers", data)
                setAll_suppliers(response.data)
            } catch {
                console.log("Failed to fetch Categories error")
            }
        }
        const fetchCategories = async () => {
            try {
                const data = {
                    "company_reg_no": company_reg_no,
                    "user_id": user_id
                }
                const response = await axios.post("http://127.0.0.1:5000/api/categories", data)
                setAll_categories(response.data)
            } catch {
                console.log("Failed to fetch Categories error")
            }
        }
        fetchProducts();
        fetchSuppliers();
        fetchCategories();
    }, [company_reg_no, user_id])

    // Filter products using useMemo to avoid recalculating on every render
    const filteredProducts = useMemo(() => {
        return all_products.filter(prod => {
            // Search filter
            const matchesSearch = search === "" || 
                prod.name.toLowerCase().includes(search.toLowerCase())
            
            // Category filter
            const matchesCategory = sortCategory === "" || sortCategory === prod.category
            
            // Supplier filter
            const matchesSupplier = sortSupplier === "" || sortSupplier === prod.supplier
            
            return matchesSearch && matchesCategory && matchesSupplier
        })
    }, [all_products, search, sortCategory, sortSupplier])

    const closeDialog = () => {
        setIsDialogActive(false)
    }
    

    return (
        <>
        <ConfirmDialog proceedFunc={proceedFunc} isActive={isDialogActive} onClose={closeDialog} message={dialogMessage}/>
        <Modal heading={modalHeading} isActive={isActive} isModalForm={isModalForm} data={modalData} onClose={closeModal} handleSubmit={handleSubmit} purpose={modalPurpose}  />
        <main className="inventory main-layout">
            <section className="inventory-options">
                <div className="upper-bar">
                    <div className="search">
                        <input 
                            type="text" 
                            placeholder="Search products by name or description"
                            value={search}
                            onChange={handleSearchChange}
                            />
                    </div>
                    <div className="categories">
                        <select name="categories" value={sortCategory} onChange={handleCategoryChange} id="categories">
                            <option value=""> -- Select Category -- </option>
                            {all_categories.map(category => (
                                <option key={category.id} value={category.name}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="suppliers">
                        <select name="suppliers" value={sortSupplier} onChange={handleSupplierChange} id="suppliers">
                            <option value=""> -- Select Suppliers -- </option>
                            {all_suppliers.map(supplier => (
                                <option key={supplier.id} value={supplier.name}>
                                    {supplier.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="lower-bar">
                <Button onclick={addCategory}>Add Category</Button>
                <Button onclick={addSupplier}>Add Supplier</Button>
                </div>
            </section>
            <section className="product-grid">
                <table>
                    <thead>
                        <tr>
                            <th>S/N</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Supplier</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((prod, index) => (
                            <tr key={prod.id} onClick={() => viewProduct(prod.id)} >
                                <td className="center">{index+1}</td>
                                <td>{prod.name}</td>
                                <td>{prod.category}</td>
                                <td className="center">{prod.quantity}</td>
                                <td className="center">{prod.unit_price}</td>
                                <td>{prod.supplier}</td>
                                <td>{prod.status ? "In Stock" : "Low stock"}</td>
                                <td className="center">
                                    <Button stopPropagation={true} onclick={() => editProduct(prod.id)}>Edit</Button>
                                    <Button stopPropagation={true} onclick={() => deleteProduct(prod.id)}>Del</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </main>
        </>
    )
}