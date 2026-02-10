import { configureStore, createSlice} from "@reduxjs/toolkit";

const initialState = {value: {
        user_id: -1,
        username: null,
        company_reg_no: "",
        loggedIn: false
    }}
const userSlice = createSlice({
    name: "user_id",
    initialState,
    reducers: {
        login: (state, action)=> {
            const {user_id, username, company_reg_no} = action.payload

            state.value.user_id = user_id;
            state.value.username = username;
            state.value.company_reg_no = company_reg_no;
            state.value.loggedIn = true;
        },

        logout: () => initialState
    }
})

const headingSlice = createSlice({
    name: "heading",
    initialState: {value: {
        heading: "Homepage",
        message: "Manage your stock inventory here"
    }},
    reducers: {
        setHeading: (state, action)=> {
            const {heading, message} = action.payload
            state.value.heading = heading
            state.value.message = message
        }
    }
})

export const {login, logout} = userSlice.actions
export const {setHeading} = headingSlice.actions

export const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        heading: headingSlice.reducer
    }
})