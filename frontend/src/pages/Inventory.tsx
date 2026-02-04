import { Button } from "../components/Button"

export const Inventory = () => {
    return (
        <main className="inventory main-layout">
            <section className="left-bar">
                <ul>
                    <li>Company Name</li>
                    <hr />
                    <li>Dashboard</li>
                    <li className="active">Inventory</li>
                    <li>Profile</li>
                    <li>Reports</li>
                    <li>Settings</li>
                    <hr />
                    <li>Logout</li>
                </ul>
            </section>
            <section className="top-bar">
                <div className="greeting">
                    <h1>Inventory</h1>
                    <p>Manage your stock inventory here</p> 
                </div>
                <div className="functionality">
                    <Button>Add Products +</Button>
                </div>
            </section>
            <section className="inventory-options">
                <div className="search">
                    <input type="text" placeholder="Search products by name or description"/>
                </div>
                <div className="categories">
                    <select name="categories" id="categories">
                        <option value="" disabled> -- Select Category -- </option>
                        <option value="Electronics">Electronics</option>
                    </select>
                </div>
                <div className="suppliers">
                    <select name="suppliers" id="suppliers">
                        <option value="" disabled> -- Select Suppliers -- </option>
                        <option value="ABC Suppliers">ABC Suppliers</option>
                    </select>
                </div>
            </section>
            <section className="product-grid">
                <table>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Supplier</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    <tr>
                        <td>001</td>
                        <td>Headphones</td>
                        <td>Electronics</td>
                        <td>23</td>
                        <td>£ 40</td>
                        <td>ABC Suppliers</td>
                        <td>In Stock</td>
                        <td>edit</td>
                    </tr>
                    <tr>
                        <td>001</td>
                        <td>Headphones</td>
                        <td>Electronics</td>
                        <td>23</td>
                        <td>£ 40</td>
                        <td>ABC Suppliers</td>
                        <td>In Stock</td>
                        <td>edit</td>
                    </tr>
                    <tr>
                        <td>001</td>
                        <td>Headphones</td>
                        <td>Electronics</td>
                        <td>23</td>
                        <td>£ 40</td>
                        <td>ABC Suppliers</td>
                        <td>In Stock</td>
                        <td>edit</td>
                    </tr>
                    <tr>
                        <td>001</td>
                        <td>Headphones</td>
                        <td>Electronics</td>
                        <td>23</td>
                        <td>£ 40</td>
                        <td>ABC Suppliers</td>
                        <td>In Stock</td>
                        <td>edit</td>
                    </tr>
                    <tr>
                        <td>001</td>
                        <td>Headphones</td>
                        <td>Electronics</td>
                        <td>23</td>
                        <td>£ 40</td>
                        <td>ABC Suppliers</td>
                        <td>In Stock</td>
                        <td>edit</td>
                    </tr>
                    <tr>
                        <td>001</td>
                        <td>Headphones</td>
                        <td>Electronics</td>
                        <td>23</td>
                        <td>£ 40</td>
                        <td>ABC Suppliers</td>
                        <td>In Stock</td>
                        <td>edit</td>
                    </tr>
                </table>
            </section>
        </main>
    )
}