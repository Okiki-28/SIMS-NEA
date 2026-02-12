import { useEffect, useMemo, useState } from "react"
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer } from "recharts"
import { api } from "../api/client"

type categoryInfo = {
    name: string,
    in_stock: number,
    low_stock: number
}

export const BarChartComponent = () => {
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
                const response = await api.post("/api/reports/bar-chart", payload)
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
    return (categoriesInfo.length > 0 ?
        <ResponsiveContainer width={"100%"} height={"100%"}>

        <BarChart width={400} height={400} data={categoriesInfo} margin={{right: 30}}>
            <CartesianGrid strokeDasharray={"3 3"}/>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="in_stock" fill="#5fb49c"/>
            <Bar dataKey="low_stock" fill="red" />
        </BarChart>
        </ResponsiveContainer> :
        <p>No data to display</p>
    )
}