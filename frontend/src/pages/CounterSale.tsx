import { useEffect, useMemo, useState } from "react"
import { Button } from "../components/Button"
import axios from "axios"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { setHeading } from "../store/store"
import { Modal } from "../components/Modal"
import { ConfirmDialog } from "../components/ConfirmDialog"

type CartItem = {
  product_id: number;
  quantity: number;
  price: string; // keep as string for Decimal safety e.g. "1200.50"
};

type CartMap = Record<number, CartItem>;

interface Product {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit_price: string; // 👈 important (money-safe)
  supplier: string;
  status: boolean;
  reorder_level: number;
}


export const CounterSale = () => {
    
    
    const dispatch = useDispatch()
    const navigate = useNavigate()
    useEffect(() => {
        dispatch(setHeading({
            heading: "Counter Sale",
            message: "Make sales over the counter"
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

    const [search, setSearch] = useState("")
    const [cart, setCart] = useState<CartMap>({});
    const [isActive, setIsActive] = useState(false)
    const [modalHeading, setModalHeading] = useState("")
    const [modalData, setModalData] = useState({})
    const [isModalForm, setIsModalForm] = useState(false)
    const [handleSubmit, setHandleSubmit] = useState<any>()
    
    const [isDialogActive, setIsDialogActive] = useState(false)
    const [proceedFunc, setProceedFunc] = useState<any>()
    const [dialogMessage, setDialogMessage] = useState("")

    const [modalPurpose, setModalPurpose] = useState("product")

    const [all_products, setAll_products] = useState<Product[]>([])
    const [addedProducts, setAddedProducts] = useState<Product[]>([])

    const addToCart = (prod_id: number, price: string) => {
        setCart(prev => {
            const existing = prev[prod_id];
            return {
            ...prev,
            [prod_id]: existing
                ? { ...existing, quantity: existing.quantity + 1 }
                : { product_id: prod_id, quantity: 1, price }
            };
        });
    };


    const handleSearchChange = (e: any) => {
        setSearch(e.target.value)
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

    const removeFromCart = (prod_id: number) => {
        const removeProd = () => {
            setCart(prev => {
                const copy = { ...prev };
                delete copy[prod_id];
                return copy;
            });
            setIsDialogActive(false)
        }
        setDialogMessage("Do you wish to remove all of this product? ")
        setIsDialogActive(true)
        setProceedFunc(() => removeProd)
    };

    const removeOneFromCart = (prod_id: number) => {
        setCart(prev => {
            const item = prev[prod_id];
            if (!item) return prev; // nothing to remove

            // if quantity becomes 0 → remove item completely
            if (item.quantity <= 1) {
                const copy = { ...prev };
                delete copy[prod_id];
                return copy;
            }

            // otherwise just decrement quantity
            return {
                ...prev,
                [prod_id]: {
                    ...item,
                    quantity: item.quantity - 1,
                },
            };
        });
    };

    const closeModal = () => {
        setIsActive(false)
    }

    const closeDialog = () => {
        setIsDialogActive(false)
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
                console.log("Error getting all products")
            }
        }
        fetchProducts();
        const fetchAddedProducts = async () => {
            try {
                const cart_of_id = Object.keys(cart).map(Number);
                const data = {
                    "company_reg_no": company_reg_no,
                    "user_id": user_id,
                    "cart": cart_of_id
                }
                const response = await axios.post("http://127.0.0.1:5000/api/products/get-some", data)
                console.log(response.data, company_reg_no)
                setAddedProducts(response.data)
            } catch {
                console.log("Error getting added products")
            }
        }
        fetchAddedProducts();
        
    }, [company_reg_no, user_id, cart])

    const filteredProducts = useMemo(() => {
        return all_products.filter(prod => {
            const matchesSearch = prod.name.toLowerCase().includes(search.toLowerCase())
            
            return matchesSearch
        })
    }, [all_products, search])

    const payAndExit = () => {
        if (!Object.keys(cart).length) {
            return
        }
        const checkout = async () => {
            const data = {
                "company_reg_no": company_reg_no,
                "user_id": user_id,
                "items": cart
            }
            console.log(data)
            try {
                const response = await axios.post("http://127.0.0.1:5000/api/sales/add", data)
                console.log(response.data)
                navigate(0)
                return response.data
            } catch {
                console.log("Unable to complete sale")
                return {}
            }
        }
        checkout();
    }
    return (
        <>
        <ConfirmDialog proceedFunc={proceedFunc} onClose={closeDialog} isActive={isDialogActive} message={dialogMessage}/>
        <Modal heading={modalHeading} isActive={isActive} isModalForm={isModalForm} data={modalData} onClose={closeModal} handleSubmit={handleSubmit} purpose={modalPurpose}  />
        <main className="main-layout counter-sale">
            <section className="search-item">
                <div className="search">
                    <input 
                    type="text" 
                    placeholder="Search products by name or description"
                    value={search}
                    onChange={handleSearchChange}
                    />
                </div>
            <Button className="paid-exit" onclick={payAndExit}>PAID, Exit</Button>
            </section>
            <section className="product-grid added-items">
                <table>
                    <thead>
                        <tr>
                            <th>S/N</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {addedProducts.map((prod, index) => (
                            <tr key={prod.id} onClick={() => viewProduct(prod.id)} >
                                <td className="center">{index+1}</td>
                                <td>{prod.name}</td>
                                <td>{prod.category}</td>
                                <td className="center">{prod.unit_price}</td>
                                <td className="center">{cart[prod.id] && cart[prod.id].quantity}</td>
                                <td className="center">
                                    <Button stopPropagation={true} onclick={() => removeOneFromCart(prod.id)}>-1</Button>
                                    <Button className="cancel" stopPropagation={true} onclick={() => removeFromCart(prod.id)}>Del</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
            <section className="product-grid">
                <table>
                    <thead>
                        <tr>
                            <th>S/N</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
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
                                <td className="center">{prod.unit_price}</td>
                                <td>{prod.quantity > prod.reorder_level ? "In Stock" : "Low stock"}</td>
                                <td className="center">
                                    {cart[prod.id] && cart[prod.id].quantity >= prod.quantity? "Low Stock":
                                    <Button stopPropagation={true} onclick={() => addToCart(prod.id, String(prod.unit_price))}>Add</Button>}
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