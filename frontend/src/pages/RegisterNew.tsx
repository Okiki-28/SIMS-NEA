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
                            <label htmlFor="company_name">Company Name: </label>
                            <input type="text" id="company_name" />
                        </div>
                        <div>
                            <label htmlFor="company_address">Company Address: </label>
                            <input type="text" id="company_address" />
                        </div>
                        <div>
                            <label htmlFor="company_tel">Company Telephone No.: </label>
                            <input type="tel" id="company_tel" />
                            
                        </div>
                        <div>
                            <label htmlFor="company_tax">Company Tax Id: </label>
                            <input type="text" id="company_tax" />
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend>User Details</legend>
                        <div>
                            <label htmlFor="user_first_name">Full Name: </label>
                            <input type="text" id="user_first_name" placeholder="John"/>
                        </div>
                        <div>
                            <label htmlFor="user_last_name">Full Name: </label>
                            <input type="text" id="user_last_name" placeholder="Doe"/>
                        </div>
                        <div>
                            <label htmlFor="user_role">Role: </label>
                            <input type="text" id="user_role" value="Admin" readOnly />
                        </div>
                        <div>
                            <label htmlFor="user_email">Email Address: </label>
                            <input type="email" id="user_email" placeholder="johndoe@company.com"/>
                        </div>
                        <div>
                            <label htmlFor="user_tel">Telephone No.: </label>
                            <input type="tel" id="user_tel" />
                        </div>
                        <div>
                            <label htmlFor="user_password">Password: </label>
                            <input type="password" id="user_password" />
                        </div>
                        <div>
                            <label htmlFor="user_confirm_password">Confirm Password: </label>
                            <input type="password" id="user_confirm_password" />
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend>Security Question</legend>
                        <div>
                            <label htmlFor="security_question">Question: </label>
                            <select id="security_questiion">
                                <option value="" disabled selected>--Choose a security question--</option>
                                <option value="mother_maiden">What is the your mother's maiden name?</option>
                                <option value="first_pet">What is the name of your first pet?</option>
                                <option value="first_school">What is the name of your first_school?</option>
                            </select>
                            <div>
                                <label htmlFor="security_response">Answer: </label>
                                <input type="text" id="security_response" />
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