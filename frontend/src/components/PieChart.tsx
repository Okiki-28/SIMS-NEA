import { useEffect, useMemo, useState } from "react"
import { PieChart, Pie, Tooltip, Legend, Bar, ResponsiveContainer } from "recharts"
import api from "../api/client"

type categoryInfo = {
    name: string,
    value: number
}

export const PieChartComponent = () => {
    const company_reg_no = useMemo(() => {
            const savedUser = localStorage.getItem("user");
            return savedUser ? JSON.parse(savedUser).company_reg_no : "";
        }, []);
        const user_id = useMemo(() => {
            const savedUser = localStorage.getItem("user");
            return savedUser ? JSON.parse(savedUser).user_id : "";
        }, []);
    const [categoriesInfo, setCategoriesInfo] = useState<categoryInfo[]>([])
    useEffect(()=>{
        const payload = {
            "company_reg_no": company_reg_no,
            "user_id": user_id
        }
        const fetchCategoriesInfo = async () => {
            try {
                const response = await api.post("/api/reports/pie-chart", payload)
                const data = response.data
                console.log(data)
                setCategoriesInfo(data)
                return data
            } catch (err) {
                console.log(err)
                return {}
            }
        }
        fetchCategoriesInfo()
    }, [user_id, company_reg_no, setCategoriesInfo])
    const COLORS = [
        "#22c55e",
        "#3b82f6",
        "#f59e0b",
        "#ef4444",
        "#8b5cf6",
    ]

    const coloredData = categoriesInfo.map((item, index) => ({
        ...item,
        fill: COLORS[index % COLORS.length],
    }))
    return (
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
    )
}