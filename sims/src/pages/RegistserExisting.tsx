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
                        <label htmlFor="company-id">Company Id</label>
                        <input type="text" id="company-Id" />
                    </div>
                    <div>
                        <label htmlFor="user-email">Email</label>
                        <input type="email" id="user-email" placeholder="johndoe@gmail.com"/>
                    </div>
                    <div>
                        <label htmlFor="user-password">Password</label>
                        <input type="password" id="user-password"/>
                    </div>
                </form>
            </section>
        </main>
    )
}