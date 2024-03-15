import React from 'react'
import { Toaster as Notify } from 'react-hot-toast';

const Toaster = () => {
    return (
        <Notify 
            toastOptions={{
                duration: 1000,
                style: {
                    background: 'rgb(27, 97, 155)',
                    color: '#fff',
                    height: '2.2rem',
                    marginTop: '3rem',
                    marginBottom: 0,
                    fontSize: '12px',
                },
            }}
        />
    )
}

export default Toaster