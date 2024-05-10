import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import { setNotifications } from '../slices/state/notificationSlice';
import { setUserFloor } from '../slices/state/userFloorslice';

const Socket = () => {

    const dispatch = useDispatch();
    const [socket, setSocket] = useState(null)
    const { isLoggedIn } = useSelector(state => state?.auth);

    useEffect(() => {
        if (!socket) {
            const newSocket = io('http://localhost:8000');

            newSocket.on('connect', () => {
                console.log('connected to a server')
            })

            newSocket.on('notification', (notification) => {
                dispatch(setNotifications({ notification: notification?.message }))
            });

            newSocket.on('clear-slot', (data) => {
                dispatch(setUserFloor({ floorData: data?.floorDetails }))
            });
            setSocket(newSocket)
        }

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [socket])



    if (!isLoggedIn) {
        return null;
    }
}

export default Socket