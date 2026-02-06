import { configureStore, createSlice} from "@reduxjs/toolkit";

const initialState = {value: {heading: "Homepage"}}
const headingSlice = createSlice({
    name: "heading",
    initialState,
    reducers: {
        setHeading: (state, action)=> {
            const {heading} = action.payload
            state.value.heading = heading
        }
    }
})

export const {setHeading} = headingSlice.actions

export const headingStore = configureStore({
    reducer: {
        heading: headingSlice.reducer
    }
})