import React, { useEffect } from 'react'
import { useRouter } from 'next/router'

import * as credentials from '/config'

export default function Auth() {
    const router = useRouter()
    const id = router.query.id
    const password = router.query.password

    console.log(id, password)

    useEffect(() => {
        async function authEmployee() {
            const deID = atob(id)
            const dePassword = atob(password)
            const res = await fetch(`${credentials.API_URL}/api/ditiosys/authEmployee`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ deID, dePassword })
            })
            const data = await res.json()
            console.log(data)
            if (data.message === "Success") {
                localStorage.setItem('log', data.token)
                router.push('/dashboard')
            } else {
                window.location.href = "https://ditiosys.com/eplogin"
            }
        }
        if (id !== undefined || password !== undefined) {
            authEmployee()
        }
    }, [id, password])

    return (
        <div>Please Wait....</div>
    )
}
