import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import Header from '../components/Header'
import { Dialog, Transition } from '@headlessui/react'
import { XCircleIcon } from '@heroicons/react/outline'
import Webcam from "react-webcam";

import * as credentials from '/config'
import { Router } from 'next/router';

export default function Dashboard() {
    const [isOpen, setIsOpen] = useState(false)
    const [isOpen2, setIsOpen2] = useState(false)
    const webcamref = useRef(null)
    const [webcam, setWebcam] = useState("")
    const [role, setRole] = useState("")
    const [loginStatus, setLoginStatus] = useState(false)
    const [breaks, setBreaks] = useState(false)

    const [onboarding, setOnboarding] = useState(0)
    const [proctoring, setProctoring] = useState(0)
    const [calls, setCalls] = useState(0)
    const [chats, setChats] = useState(0)
    const [tech, setTech] = useState(0)
    const [other, setOther] = useState("")

    useEffect(() => {
        const log = localStorage.getItem('log')
        if (!log) {
            window.location.href = "https://ditiosys.com/"
        }
    })

    function closeModal() {
        setIsOpen(false)
    }

    useEffect(() => {
        getEmployeeStatus()
    }, [])

    async function getEmployeeStatus() {
        const log = localStorage.getItem('log')
        const res = await fetch(`${credentials.API_URL}/api/ditiosys/getEmployeeStatus`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ log })
        })
        const data = await res.json()
        console.log(data.records[0])
        if (data.records[0].status == "ACTIVE") {
            setLoginStatus(true)
        } else if (data.records[0].status == "INBREAK") {
            setLoginStatus(true)
            setBreaks(true)
        } else {
            setLoginStatus(false)
        }
    }

    const capture = useCallback(
        () => {
            var webcamera = document.getElementById('webcamera')
            var image = document.getElementById('image')
            var update = document.getElementById('update')

            const imageSrc = webcamref.current.getScreenshot();
            console.log(imageSrc)
            setWebcam(imageSrc)
            webcamera.classList.add('hidden')
            image.classList.remove('hidden')
            update.classList.remove('hidden')
            update.classList.add('inline-flex')
        },
        [webcamref]
    );

    function recapture() {
        var webcamera = document.getElementById('webcamera')
        var image = document.getElementById('image')
        var update = document.getElementById('update')

        webcamera.classList.remove('hidden')
        image.classList.add('hidden')
        update.classList.remove('inline-flex')
        update.classList.add('hidden')
        setWebcam("")
    }

    async function updateLoginStatus() {
        const log = localStorage.getItem('log')
        if (log) {
            const ipres = await fetch('https://geolocation-db.com/json/')
            const ipdata = await ipres.json()
            const logInIP = ipdata.IPv4
            const res = await fetch(`${credentials.API_URL}/api/ditiosys/updateLoginEmployeeStatus`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ webcam, role, log, logInIP })
            })
            const data = await res.json()
            console.log(data)
            if (data.message == "Updated") {
                setWebcam("")
                setIsOpen(false)
                setRole("")
                getEmployeeStatus()
            }
        } else {
            window.location.href = "https://ditiosys.com/"
        }
    }

    async function updateLogoutStatus() {
        const log = localStorage.getItem('log')
        if (log) {
            const ipres = await fetch('https://geolocation-db.com/json/')
            const ipdata = await ipres.json()
            const logOutIP = ipdata.IPv4

            const eod = {
                onboarding,
                proctoring,
                calls,
                chats,
                tech,
                other
            }

            const res = await fetch(`${credentials.API_URL}/api/ditiosys/updateLogoutEmployeeStatus`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ webcam, logOutIP, log, eod })
            })
            const data = await res.json()
            console.log(data)
            if (data.message === "Updated") {
                setWebcam("")
                setIsOpen2(false)
                setRole("")
                getEmployeeStatus()
                localStorage.removeItem('log')
                window.location.href = "https://ditiosys.com"
            }
        } else {
            window.location.href = "https://ditiosys.com/"
        }
    }

    async function startBreak() {
        const log = localStorage.getItem('log')
        if (log) {
            if (breaks) {
                setBreaks(false)
                const res = await fetch(`${credentials.API_URL}/api/ditiosys/updateEndBreak`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ log })
                })
                const data = await res.json()
            } else {
                setBreaks(true)
                const res = await fetch(`${credentials.API_URL}/api/ditiosys/updateStartBreak`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ log })
                })
                const data = await res.json()
            }
        }
    }

    return (
        <>
            <div className="bg-gray-300 min-h-screen">
                <Header />
                <div className="bg-white max-w-[96%] mx-auto shadow-xl rounded-2xl mt-2">
                    {loginStatus ? <>
                        <button onClick={() => setIsOpen2(true)} className={`${breaks ? 'hidden' : null} m-5 inline-flex justify-center px-4 py-2 text-sm font-medium text-orange-900 bg-orange-100  border border-transparent rounded-md hover:bg-orange-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500`}>Logout</button>
                        <button onClick={() => startBreak()} className="m-5 inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100  border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500">{breaks ? <>End Break</> : <>Start Break</>}</button>
                    </> : <>
                        <button onClick={() => setIsOpen(true)} className="m-5 inline-flex justify-center px-4 py-2 text-sm font-medium text-orange-900 bg-orange-100  border border-transparent rounded-md hover:bg-orange-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500">Login</button>
                    </>}
                </div>
            </div>
        </>
    )
}
