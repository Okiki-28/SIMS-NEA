import { useSelector } from "react-redux"
import { Button } from "../components/Button"
import { useDispatch } from "react-redux"
import { setHeading } from "../store/authstore"
import { useEffect, useState } from "react"
import axios from "axios"
import { error } from "console"
import { useNavigate } from "react-router-dom"

export const Dashboard = () => {
    const [productCount, setProductCount] = useState(0)
    const [lowStockCount, setLowStockCount] = useState(0)
    const [recentSales, setRecentSales] = useState(0)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    useEffect(() => {
        dispatch(setHeading({
            heading: "Dashboard"
        }));
    }, [dispatch]);
    const savedUser = localStorage.getItem('user')
    let username = ""
    let company_reg = ""
    if (savedUser) {
        username = JSON.parse(savedUser)['username']
        company_reg = JSON.parse(savedUser)['company_reg']
    }
    useEffect(()=> {
        const getProductCount = async () => {
            try {
                const response = await axios.post("http://127.0.0.1:5000/api/products/get-total-count", {"company_reg_no": company_reg})
                setProductCount(response.data.product_count)
                return response.data.product_count
            } catch {
                console.log("Erro getting product count")
            }
        }
        const getLowStockCount = async () => {
            try {
                const response = await axios.post("http://127.0.0.1:5000/api/products/get-low-stock-count", {"company_reg_no": company_reg})
                setLowStockCount(response.data.low_stock_count)
                return response.data.low_stock_count
            } catch {
                console.log("Error getting low stock count")
            }
        }
        const getRecentSales = async () => {
            try {
                const response = await axios.post("http://127.0.0.1:5000/api/sales/get-recent-sales", {"company_reg_no": company_reg})
                console.log(response.data)
                setRecentSales(response.data.total_sales)
                return response.data.low_stock_count
            } catch {
                console.log("Error getting recent sales")
            }
        }
        getLowStockCount()
        getProductCount()
        getRecentSales()
    }, [company_reg])


    return (
        <main className="dashboard main-layout">
            <section className="overview">
                <div className="total-products">
                    <h2>Total Products</h2>
                    <p className="number">{productCount}</p>
                    <p className="comment">up 5% from last week</p>
                </div>
                <div className="low-stock-alerts">
                    <h2>Low Stock Alerts</h2>
                    <p className="number">{lowStockCount}</p>
                    <p className="comment">up 5% from last week</p>
                </div>
                <div className="recent-sales">
                    <h2>Recent Sales</h2>
                    <p className="number">£{recentSales}</p>
                    <p className="comment">in the last month</p>
                </div>
                <div className="monthly-revenue">
                    <h2>Monthly Revenue</h2>
                    <p className="number">-$5,000</p>
                    <p className="comment">up 5% from last week</p>
                </div>
            </section>
        </main>
    )
}