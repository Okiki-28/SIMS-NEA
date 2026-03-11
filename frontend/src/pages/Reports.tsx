import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { setHeading } from "../store/store";
import { Button } from "../components/Button";

import { LineChartComponent } from "../components/LineChart";
import { BarChartComponent } from "../components/BarChart";
import { PieChartComponent } from "../components/PieChart";
import api from "../api/client";

import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer } from "recharts"


type pieChartData = {
    name: string,
    value: number
}

interface Product {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit_price: string; // 👈 important (money-safe)
  selling_price: string; // 👈 important (money-safe)
  supplier: string;
  status: boolean;
  reorder_level: number;
  stock_value: number;
}

interface costBreakdown {
    category: string;
    cost_value: number;
    selling_value: number;
    potential_profit: number;
}

interface stockValueInterface {
    total_cost_value: number;
    total_selling_value: number;
    total_potential_profit: number;
    breakdown: costBreakdown[];
}

interface saleProfitBreakdown {
    date: string;
    revenue: number;
    cost: number;
    profit: number;
    sales_count: number;
    margin_pct: number;
}

interface saleProfitInterface {
    total_revenue: number;
    total_cost: number;
    total_profit: number;
    breakdown: saleProfitBreakdown[];
}

export const Reports = () => {

    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(setHeading({
            heading: "Reports",
            message: "Generate reports and summaries here"
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

    const [chartData, setChartData] = useState<pieChartData[]>([])
    const [chartData1, setChartData1] = useState<pieChartData[]>([])
    const [isUserAdmin, setIsUserAdmin] = useState(false)
    const [logData, setLogData] = useState("")
    const [showLogs, setShowLogs] = useState(false)
    
    const [deadStock, setDeadStock] = useState<Product[]>([])
    const [stockValue, setStockValue] = useState<stockValueInterface>()
    const [saleProfit, setSaleProfit] = useState<saleProfitInterface>()


    
    
    useEffect(()=>{
        const payload = {
            "company_reg_no": company_reg_no,
            "user_id": user_id
        }
        
        const fetchCategoriesInfo = async () => {
            try {
                const response = await api.post("/api/reports/supplier-sale", payload)
                const data = response.data
                console.log(data)
                setChartData(data)
                return data
            } catch (err) {
                console.log(err)
                return {}
            }
        }
        fetchCategoriesInfo()
        const isAdmin = async () => {
            try {
                const response = await api.post("/api/users/isAdmin", payload)
                const data = response.data.status
                console.log(data)
                setIsUserAdmin(data)
                return data
            } catch (err) {
                console.log(err)
                return {}
            }
        }
        isAdmin()
        const fetchSuppliersInfo = async () => {
            try {
                const response = await api.post("/api/reports/category-sale", payload)
                const data = response.data
                console.log(data)
                setChartData1(data)
                return data
            } catch (err) {
                console.log(err)
                return {}
            }
        }
        fetchSuppliersInfo()

        const fetchDeadStock = async () => {
            try {
                const data = {
                    "company_reg_no": company_reg_no,
                    "user_id": user_id
                }
                const response = await api.post("/api/reports/dead-stock", data)
                console.log(response.data, company_reg_no)
                setDeadStock(response.data)
            } catch {
                console.log("Error getting dead Stock")
            }
        }
        fetchDeadStock();

        const fetchStockValue = async () => {
            try {
                const data = {
                    "company_reg_no": company_reg_no,
                    "user_id": user_id
                }
                const response = await api.post("/api/reports/stock-value", data)
                console.log(response.data, company_reg_no)
                setStockValue(response.data)
            } catch {
                console.log("Error getting Stock vlaue data")
            }
        }
        fetchStockValue();
        
        const fetchSaleProfit = async () => {
            try {
                const data = {
                    "company_reg_no": company_reg_no,
                    "user_id": user_id
                }
                const response = await api.post("/api/reports/sale-profit", data)
                console.log(response.data, company_reg_no)
                setSaleProfit(response.data)
            } catch {
                console.log("Error getting Stock vlaue data")
            }
        }
        fetchSaleProfit();
        
        
    }, [user_id, company_reg_no, setChartData, setChartData1])
    const displayCompanyLogs = () => {
        if (isUserAdmin === false) {
                return false
            }
        if (showLogs) {
            setShowLogs(false)
            return
        }
        const payload = {
            "company_reg_no": company_reg_no,
            "user_id": user_id
        }
        const getCompanyLogs = async () => {
            
            try {
                const response = await api.post("/api/logs/get", payload)
                const data = response.data
                console.log(data)
                setLogData(data)
                return data
            } catch (err) {
                console.log(err)
                return {}
            }
        }

        getCompanyLogs()
        setShowLogs(true)
    }
    
    const COLORS = [
    "#22c55e", // green
    "#3b82f6", // blue
    "#f59e0b", // amber
    "#ef4444", // red
    "#8b5cf6", // violet

    "#06b6d4", // cyan
    "#ec4899", // pink
    "#84cc16", // lime
    "#f97316", // orange
    "#14b8a6", // teal
    "#eab308", // yellow
    "#6366f1", // indigo
    "#a855f7", // purple
    "#10b981", // emerald
    "#fb7185", // rose
];

    const coloredData = chartData.map((item, index) => ({
        ...item,
        fill: COLORS[index % COLORS.length],
    }))
    const coloredData1 = chartData1.map((item, index) => ({
        ...item,
        fill: COLORS[index % COLORS.length],
    }))
        

    return (
        <main className="main-layout reports">
            <div className="charts">
            <div className="text-info">
                <h2>Stock Value</h2>
                <p>Total Cost Value: £{stockValue?.total_cost_value}</p>
                <p>Total Selling Value: £{stockValue?.total_selling_value}</p>
                <p>Total Potential Profit: £{stockValue?.total_potential_profit}</p>
            </div>
            <div className="product-grid">
                <h2>Stock Value Breakdown</h2>
                <table>
                    <thead>
                        <tr>
                            <th>S/N</th>
                            <th>Category</th>
                            <th>Cost Value</th>
                            <th>Selling Value</th>
                            <th>Potential Profit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stockValue?.breakdown.map((prod, index) => (
                            <tr key={index} >
                                <td className="center">{index+1}</td>
                                <td>{prod.category}</td>
                                <td>{prod.cost_value}</td>
                                <td className="center">{prod.selling_value}</td>
                                <td className="center">{prod.potential_profit}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            
                <div className="chart line">
                    <h1>Daily Sales trend </h1>
                    <LineChartComponent />
                </div>
                <div className="chart pie">
                    <h1>Stock Categroies</h1>
                    <PieChartComponent />
                </div>
                <div className="text-info">
                    <h2>Sales Profit</h2>
                    <p>total revenue: £{saleProfit?.total_revenue}</p>
                    <p>total cost: £{saleProfit?.total_cost}</p>
                    <p>total profit: £{saleProfit?.total_profit}</p>
                </div>
                <div className="product-grid">
                    <h2>Sale Profit Breakdown</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>S/N</th>
                                <th>date</th>
                                <th>revenue</th>
                                <th>cost</th>
                                <th>profit</th>
                                <th>sales_count</th>
                                <th>margin_pct</th>
                            </tr>
                        </thead>
                        <tbody>
                            {saleProfit?.breakdown.map((prod, index) => (
                                <tr key={index} >
                                    <td className="center">{index+1}</td>
                                    <td>{prod.date}</td>
                                    <td>{prod.revenue}</td>
                                    <td>{prod.cost}</td>
                                    <td>{prod.profit}</td>
                                    <td>{prod.sales_count}</td>
                                    <td>{prod.margin_pct}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="chart bar">
                    <h1>Stock Levels by Category</h1>
                    <BarChartComponent />
                </div>
                
                <div className="chart pie">
                    <h1>Sales by Suppliers</h1>
                    <ResponsiveContainer width={"100%"} height={"100%"}>
                        <PieChart width={400} height={400}>
                            <Pie
                                data={coloredData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={120}
                                innerRadius={40}
                                label
                            />
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                
                <div className="chart pie">
                    <h1>Sales by Categories</h1>
                    <ResponsiveContainer width={"100%"} height={"100%"}>
                        <PieChart width={400} height={400}>
                            <Pie
                                data={coloredData1}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={120}
                                innerRadius={40}
                                label
                            />
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                { deadStock.length > 0 ?
                <div className="product-grid">
                    <h2>Dead Stock</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>S/N</th>
                                <th>Name</th>
                                <th>Quantity</th>
                                <th>Cost Price</th>
                                <th>Stock Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deadStock.map((prod, index) => (
                                <tr key={prod.id} >
                                    <td className="center">{index+1}</td>
                                    <td>{prod.name}</td>
                                    <td>{prod.quantity}</td>
                                    <td className="center">{prod.unit_price}</td>
                                    <td className="center">{prod.stock_value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>:
                <p>No dead Stocks in the last30 days</p>
                }
            </div>
            {isUserAdmin && <Button onclick={displayCompanyLogs}>VIEW COMPANY LOGS</Button>}
            {showLogs && (
                <pre>
                    {JSON.stringify(logData, null, 2)}
                </pre>
            )}
        </main>
    )
}