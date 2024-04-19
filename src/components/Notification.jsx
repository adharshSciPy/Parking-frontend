import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setNotifications } from '../slices/state/notificationSlice'
// import toast from 'react-hot-toast';

const Notification = () => {

    const dispatch = useDispatch();
    const { isLoggedIn, userRole, userId } = useSelector(state => state?.auth);
    const BASE_URL = import.meta.env.VITE_APP_API_BASE_URL

    useEffect(() => {
        if (isLoggedIn && userRole === 'user') {
            const eventSource = new EventSource(`${BASE_URL}notification/notify-end-time?userId=${userId}`);
            eventSource.onopen = () => {
                console.log('Connection to server opened');
            };

            eventSource.onmessage = (event) => {

                if (event.type === 'message') {
                    let data = JSON.parse(event.data)
                    let floorNumber = data?.floorNumber || 'Nil'
                    let slotNumber = data?.slotDetails?.slotNumber || 'Nil'
                    let message = `Slot ${slotNumber} in Floor No ${floorNumber} schedule almost over`
                    dispatch(setNotifications({ notification: message }))
                    // toast(message, { duration: 3000 });
                }
            };

            return () => {
                eventSource.close();
            };
        }
    }, [isLoggedIn]);

    if (!isLoggedIn) {
        return null
    }

}

export default Notification