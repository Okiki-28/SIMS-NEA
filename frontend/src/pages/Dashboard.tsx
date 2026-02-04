import { useSelector } from "react-redux"
import { Button } from "../components/Button"

export const Dashboard = () => {
    
    const username = useSelector((state: any)=>state.user.value.username)

    return (
        <main className="dashboard main-layout">
            <section className="left-bar">
                <ul>
                    <li className="active">Dashboard</li>
                    <li>Inventory</li>
                    <li>Profile</li>
                    <li>Reports</li>
                    <li>Settings</li>
                    <hr />
                    <li>Logout</li>
                </ul>
            </section>
            <section className="top-bar">
                <div className="greeting">
                    <h1>Dashboard</h1>
                    <p>Welcome back, {username}. Here's your stock overview</p> 
                </div>
                <div className="functionality">
                    <Button>Add Products +</Button>
                    <Button>Generate Report</Button>
                </div>
            </section>
            <section className="overview">
                <div className="total-products">
                    <h2>Total Products</h2>
                    <p className="number">219</p>
                    <p className="comment">up 5% from last week</p>
                </div>
                <div className="low-stock-alerts">
                    <h2>Low Stock Alerts</h2>
                    <p className="number">17</p>
                    <p className="comment">up 5% from last week</p>
                </div>
                <div className="recent-sales">
                    <h2>Recent Sales</h2>
                    <p className="number">$12,000</p>
                    <p className="comment">up 5% from last week</p>
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