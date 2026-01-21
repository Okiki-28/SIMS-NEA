import { Button } from "../components/Button";
import { ButtonType } from "../components/Button";
import { Link } from "react-router-dom";


// Stay open
export const RegisterNew = () => {
    return (
        <main>
            <section className="standalone register new">
                <div className="greeting">
                    <h1>Register</h1>
                    <p>Register with <em>New</em> company</p>
                </div>
                <form>
                    <fieldset>
                        <legend>Company Details</legend>
                        <div>
                            <label htmlFor="company-name">Company Name: </label>
                            <input type="text" id="company-name" />
                        </div>
                        <div>
                            <label htmlFor="company-address">Company Address: </label>
                            <input type="text" id="company-address" />
                        </div>
                        <div>
                            <label htmlFor="company-tel">Company Telephone No.: </label>
                            <input type="tel" id="company-tel" />
                            
                        </div>
                        <div>
                            <label htmlFor="company-tax">Company Tax Id: </label>
                            <input type="text" id="company-tax" />
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend>User Details</legend>
                        <div>
                            <label htmlFor="user-fullname">Full Name: </label>
                            <input type="text" id="user-fullname" placeholder="Lastname Firstname"/>
                        </div>
                        <div>
                            <label htmlFor="user-role">Role: </label>
                            <input type="text" id="user-role" value="Admin" readOnly />
                        </div>
                        <div>
                            <label htmlFor="user-email">Email Address: </label>
                            <input type="email" id="user-email" placeholder="johndoe@company.com"/>
                        </div>
                        <div>
                            <label htmlFor="user-tel">Telephone No.: </label>
                            <input type="tel" id="user-tel" />
                        </div>
                        <div>
                            <label htmlFor="user-password">Password: </label>
                            <input type="password" id="user-password" />
                        </div>
                        <div>
                            <label htmlFor="user-confirm-password">Confirm Password: </label>
                            <input type="password" id="user-confirm-password" />
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend>Security Question</legend>
                        <div>
                            <label htmlFor="security-question">Question: </label>
                            <select id="security-questiion">
                                <option value="" disabled selected>--Choose a security question--</option>
                                <option value="mother_maiden">What is the name of your mother's maiden name?</option>
                                <option value="first_pet">What is the name of your first pet?</option>
                                <option value="first_school">What is the name of your first_school?</option>
                            </select>
                            <div>
                                <label htmlFor="security-response">Answer: </label>
                                <input type="text" id="security-response" />
                            </div>
                        </div>
                    </fieldset>
                    <Button type={ButtonType.submit}>Submit</Button>
                </form>
                <Link to="/login" className="reg-login">Already have an account?</Link>
            </section>
        </main>
    )
}