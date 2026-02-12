import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setHeading } from "../store/store";
import { Button } from "../components/Button";

import { LineChartComponent } from "../components/LineChart";
import { BarChartComponent } from "../components/BarChart";
import { PieChartComponent } from "../components/PieChart";
import api from "../api/client";

import { PieChart, Pie, Tooltip, Legend, Bar, ResponsiveContainer } from "recharts"


type pieChartData = {
    name: string,
    value: number
}

export const Reports = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
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
    }, [user_id, company_reg_no, setChartData, setChartData1])
    const COLORS = [
        "#22c55e",
        "#3b82f6",
        "#f59e0b",
        "#ef4444",
        "#8b5cf6",
    ]

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
                <div className="chart line">
                    <h1>Daily Sales trend </h1>
                    <LineChartComponent />
                </div>
                <div className="chart pie">
                    <h1>Stock Categroies</h1>
                    <PieChartComponent />
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
            </div>
        </main>
    )
}