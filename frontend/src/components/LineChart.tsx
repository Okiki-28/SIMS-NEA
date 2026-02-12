
import { useEffect, useMemo, useState } from "react"
import { LineChart, XAxis, Tooltip, YAxis, Line, ResponsiveContainer, Legend } from "recharts"
import { api } from "../api/client"

type categoryInfo = {
    date: string
    sales: number
    sales_count: number
}

export const LineChartComponent = () => {
    const company_reg_no = useMemo(() => {
            const savedUser = localStorage.getItem("user");
            return savedUser ? JSON.parse(savedUser).company_reg_no : "";
        }, []);
        const user_id = useMemo(() => {
            const savedUser = localStorage.getItem("user");
            return savedUser ? JSON.parse(savedUser).user_id : "";
        }, []);
    const [salesData, setSalesData] = useState<categoryInfo[]>([])
    useEffect(()=>{
        const payload = {
            "company_reg_no": company_reg_no,
            "user_id": user_id
        }
        const fetchCategoriesInfo = async () => {
            try {
                const response = await api.post("/api/reports/line-chart", payload)
                const data = response.data
                console.log(data)
                setSalesData(data)
                return data
            } catch (err) {
                console.log(err)
                return {}
            }
        }
        fetchCategoriesInfo()
    }, [user_id, company_reg_no, setSalesData])
    return (
        <ResponsiveContainer width={"100%"} height={"100%"}>
            <LineChart data={salesData} margin={{right: 30}}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#5fb49c" />
                <Line type="monotone" dataKey="sales_count" stroke="#40476d" />
            </LineChart>
        </ResponsiveContainer>
    )
}