import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const Notification = () => {

    const [notification, setNotification] = useState('')
    const { isLoggedIn, userRole, userId } = useSelector(state => state?.auth);
    const BASE_URL = import.meta.env.VITE_APP_API_BASE_URL

    useEffect(() => {
        if (isLoggedIn && userRole === 'user') {
            const eventSource = new EventSource(`${BASE_URL}notification/notify-end-time?userId=${userId}`);
            eventSource.onopen = () => {
                console.log('Connection to server opened');
            };

            eventSource.onmessage = (event) => {
                const data = event.data;
                console.log('Received message:', data);
            };

            return () => {
                eventSource.close(); // Close the connection when component unmounts
            };
        }
    }, [isLoggedIn]);

    if (!isLoggedIn) {
        return null
    }
}

export default Notification