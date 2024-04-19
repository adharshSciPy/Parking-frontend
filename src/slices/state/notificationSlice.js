import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    notifications: []
}

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        setNotifications: (state, action) => {
            const { notification } = action.payload;
            const existingNotificationIndex = state.notifications.findIndex(n => n === notification);
            if (existingNotificationIndex === -1) {
                state.notifications.push(notification);
            }
        },
        clearNotifications: (state, aciton) => {
            state.notifications = []
        }
        
    }
})


export const { setNotifications, clearNotifications } = notificationSlice.actions
export default notificationSlice.reducer;