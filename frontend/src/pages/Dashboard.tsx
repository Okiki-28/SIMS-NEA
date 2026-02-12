import { useSelector } from "react-redux"
import { Button } from "../components/Button"
import { useDispatch } from "react-redux"
import { setHeading } from "../store/store"
import { useEffect, useState } from "react"
import { error } from "console"
import { useNavigate } from "react-router-dom"
import { useMemo } from "react"

import { BarChartComponent } from "../components/BarChart"
import { PieChartComponent } from "../components/PieChart"
import { LineChartComponent } from "../components/LineChart"
import { api } from "../api/client"


export const Dashboard = () => {
    const [productCount, setProductCount] = useState(0)
    const [categoriesCount, setCategoriesCount] = useState(0)
    const [lowStockCount, setLowStockCount] = useState(0)
    const [individualProductCount, setIndividualProductCount] = useState(0)
    const [recentSales, setRecentSales] = useState(0)
    const [timePeriod, setTimePeriod] = useState(0)
    const [bestSeller, setBestSeller] = useState({
        "product_name": "",
        "total_quantity": 0
    })
    const dispatch = useDispatch()
    const navigate = useNavigate()
    useEffect(() => {
        dispatch(setHeading({
            heading: "Dashboard",
            message: "View an overview of your inventory"
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
    useEffect(()=> {
        const getProductCount = async () => {
            const payload = {
                "company_reg_no": company_reg_no,
                "user_id": user_id
            }
            try {
                const response = await api.post("/api/products/get-total-count", payload)
                console.log(response.data)
                setProductCount(response.data.product_count)
                setCategoriesCount(response.data.categories_count)
                return response.data.product_count
            } catch {
                console.log("Error getting product count")
            }
        }
        const getLowStockCount = async () => {
            const payload = {
                "company_reg_no": company_reg_no,
                "user_id": user_id
            }
            try {
                const response = await api.post("/api/products/get-low-stock-count", payload)
                setLowStockCount(response.data.low_stock_count)
                setIndividualProductCount(response.data.product_count)
                return response.data.low_stock_count
            } catch {
                console.log("Error getting low stock count")
            }
        }
        const getRecentSales = async () => {
            const payload = {
                "company_reg_no": company_reg_no,
                "user_id": user_id
            }
            try {
                const response = await api.post("/api/sales/get-recent-sales", payload)
                console.log(response.data)
                setRecentSales(response.data.total_sales)
                setTimePeriod(response.data.time_period)
                return response.data.total_sales
            } catch {
                console.log("Error getting recent sales")
            }
        }
        const getBestSeller = async () => {
            const payload = {
                "company_reg_no": company_reg_no,
                "user_id": user_id
            }
            try {
                const response = await api.post("/api/sales/get-best-seller", payload)
                console.log(response.data)
                setBestSeller(response.data.best_seller)
                return response.data.best_seller
            } catch {
                console.log("Error getting best seller")
            }
        }
        getLowStockCount()
        getProductCount()
        getRecentSales()
        getBestSeller()
    }, [company_reg_no])


    return (
        <main className="dashboard main-layout">
            <section className="overview">
                <div className="total-products">
                    <h2>Total Units</h2>
                    <p className="number">{productCount}</p>
                    <p className="comment">accross {categoriesCount} categories</p>
                </div>
                <div className="low-stock-alerts">
                    <h2>Low Stock Alerts</h2>
                    <p className="number">{lowStockCount}</p>
                    <p className="comment">accross {individualProductCount} products</p>
                </div>
                <div className="recent-sales">
                    <h2>Recent Sales</h2>
                    <p className="number">£{recentSales}</p>
                    <p className="comment">in the last {timePeriod} days</p>
                </div>
                <div className="best-seller">
                    <h2>Best Seller</h2>
                    <p className="text">{bestSeller? bestSeller.product_name: "null"}</p>
                    <p className="comment">{bestSeller && bestSeller.total_quantity} items sold</p>
                </div>
            </section>
            <section className="charts">
                <div className="line chart">
                    <h1>Sale Daily Trend</h1>
                    <LineChartComponent />
                </div>
                <div className="pie chart">
                    <h1>Stock Categories</h1>
                    <PieChartComponent />
                </div>
                <div className="bar chart">
                    <h1>Stock Levels by Category</h1>
                    <BarChartComponent />
                </div>
            </section>
        </main>
    )
}