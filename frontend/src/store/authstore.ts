import { configureStore, createSlice} from "@reduxjs/toolkit";

const initialState = {value: {
        user_id: -1,
        username: null,
        loggedIn: false
    }}
const userSlice = createSlice({
    name: "user_id",
    initialState,
    reducers: {
        login: (state, action)=> {
            const {user_id, username} = action.payload

            state.value.user_id = user_id;
            state.value.username = username;
            state.value.loggedIn = true;
        },

        logout: () => initialState
    }
})

export const {login, logout} = userSlice.actions

export const authStore = configureStore({
    reducer: {
        user: userSlice.reducer
    }
})