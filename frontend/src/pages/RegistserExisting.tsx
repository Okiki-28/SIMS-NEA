export const RegisterExisting = () => {
    return (
        <main>
            <section className="standalone register existing">
                <div className="greeting">
                    <h1>Register</h1>
                    <p>Register with <em>Existing</em> Company</p>
                </div>
                <form>
                    <div>
                        <label htmlFor="company_reg_no">Company Reg No</label>
                        <input type="text" id="company_reg_no" />
                    </div>
                    <div>
                        <label htmlFor="user_first_name">Full Name: </label>
                        <input type="text" id="user_first_name" placeholder="John"/>
                    </div>
                    <div>
                        <label htmlFor="user_last_name">Full Name: </label>
                        <input type="text" id="user_last_name" placeholder="Doe"/>
                    </div>
                    {/* Add dropdown menu here */}
                    <div>
                        <label htmlFor="user_role">Role: </label>
                        <input type="text" id="user_role" />
                    </div>
                    <div>
                        <label htmlFor="user_email">Email</label>
                        <input type="email" id="user_email" placeholder="johndoe@gmail.com"/>
                    </div>
                    <div>
                        <label htmlFor="user_tel">Telephone No.: </label>
                        <input type="tel" id="user_tel" />
                    </div>
                    <div>
                        <label htmlFor="user_password">Password</label>
                        <input type="password" id="user_password"/>
                    </div>
                    <div>
                        <label htmlFor="user_confirm_password">Confirm Password: </label>
                        <input type="password" id="user_confirm_password" />
                    </div>
                </form>
            </section>
        </main>
    )
}