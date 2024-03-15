import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : null,
    isLoggedIn: false,
    userId: null,
    userRole: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {

        setCredentials: (state, action) => {
            const { token } = action.payload;
            state.token = token;
            state.isLoggedIn = true,
                localStorage.setItem('token', JSON.stringify(token))
        },
        setRole: (state, action) => {
            const { role, userId } = action.payload;
            state.userRole = role;
            state.userId = userId;
        },
        setLogout: (state) => {
            localStorage.removeItem('token');
            localStorage.removeItem('currentUserRole');
            state.isLoggedIn = false;
            state.token = null;
            state.userRole = null;
            state.userId = null;
        }
    }
})


export const { setCredentials, setLoggedIn, setRole, setLogout } = authSlice.actions
export default authSlice.reducer;