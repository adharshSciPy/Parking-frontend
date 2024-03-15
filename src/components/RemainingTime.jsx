import React, { useState, useEffect } from 'react';

const RemainingTime = ({ endTimestamp }) => {
    const [remainingTime, setRemainingTime] = useState('');

    useEffect(() => {
        const currentTime = new Date().getTime();
        const endTime = new Date(endTimestamp).getTime();
        let remainingTime = endTime - currentTime;

        // Check if remaining time is within 60 minutes
        if (remainingTime <= 60 * 60 * 1000) {
            // Ensure remaining time is non-negative
            remainingTime = Math.max(remainingTime, 0);

            const hours = Math.floor(remainingTime / (1000 * 60 * 60));
            remainingTime %= (1000 * 60 * 60);
            const minutes = Math.floor(remainingTime / (1000 * 60));

            let formattedTime = '';
            if (hours > 0) {
                formattedTime = `${hours} hours`;
            }
            if (minutes > 0) {
                formattedTime += ` ${minutes} minutes`;
            }

            setRemainingTime(formattedTime.trim());
        } else {
            setRemainingTime('');
        }
    }, [endTimestamp]);

    return (
        <div>
            <p>{remainingTime}</p>
        </div>
    );
};

export default RemainingTime;
