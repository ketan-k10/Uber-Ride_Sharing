import React, { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export const CaptainLogout = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token')
        axios.get(`${import.meta.env.VITE_BASE_URL}/captains/logout`, {
            headers: { Authorization: `Bearer ${token}` }
        }).finally(() => {
            // Always clear the session and return to login, even if the call fails
            localStorage.removeItem('token')
            navigate('/captain-login')
        })
    }, [ navigate ])

    return (
        <div className='h-full flex flex-col items-center justify-center bg-background gap-3'>
            <div className='h-10 w-10 rounded-full border-4 border-borderColor border-t-primary animate-spin'></div>
            <p className='text-sm text-textMuted'>Signing out…</p>
        </div>
    )
}

export default CaptainLogout
