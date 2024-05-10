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
        
            // Clear existing notifications
            state.notifications = [];
        
            // Check if notification is an array and remove duplicates
            const uniqueNotifications = notification && Array.isArray(notification)
                ? notification.filter((item, index, self) =>
                    index === self.findIndex(n =>
                        n.notification === item.notification &&
                        n.floorNumber === item.floorNumber &&
                        n.slotNumber === item.slotNumber
                    )
                )
                : [];
        
            uniqueNotifications.forEach(newNotification => {
                state.notifications.push(newNotification);
            });
        },
        


        clearNotifications: (state, aciton) => {
            state.notifications = []
        }

    }
})


export const { setNotifications, clearNotifications } = notificationSlice.actions
export default notificationSlice.reducer;