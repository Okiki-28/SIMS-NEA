import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export const Sidebar = () => {
    const savedUser = localStorage.getItem('user')
    let user 
    let company_reg_no
    if (savedUser) {   
        user = JSON.parse(savedUser)['username']
        company_reg_no = JSON.parse(savedUser)['company_reg_no']
    }
    let pageHeading = useSelector((state: any) => state.heading.value.heading)
    return (
        <section className="left-bar">
            <ul>
                <li><Link to={"/"}>{company_reg_no}</Link></li>
                <hr />
                <li className={pageHeading == "Dashboard"? "active": ""}><Link to="/dashboard">Dashboard</Link></li>
                {/* <li className="active">Inventory</li> */}
                <li className={pageHeading == "Inventory"? "active": ""}><Link to="/inventory">Inventory</Link></li>
                <li className={pageHeading == "Counter Sale"? "active": ""}><Link to="/counter-sale">Counter Sale</Link></li>
                <li className={pageHeading == "Reports"? "active": ""}><Link to="/reports">Reports</Link></li>
                <li className={pageHeading == "Settings"? "active": ""}><Link to="/settings">Settings</Link></li>
                <hr />
                <li><Link to="/Logout">Logout</Link></li>
            </ul>
        </section>
    )
};