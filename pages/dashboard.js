import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import Header from '../components/Header'
import { Dialog, Transition } from '@headlessui/react'
import { XCircleIcon } from '@heroicons/react/outline'
import Webcam from "react-webcam";
import * as toastr from 'toastr'

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
    const [showToastr, setShowToastr] = useState(false)
    const [showToastr2, setShowToastr2] = useState(false)

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
        setShowToastr(false)
        if (log) {
            const ipres = await fetch('https://geolocation-db.com/json/')
            const ipdata = await ipres.json()
            const logInIP = ipdata.IPv4
            if (logInIP === '106.51.80.197' || logInIP === '223.233.82.214') {
                console.log(true)
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
                console.log(false)
                setShowToastr(true)
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

            if (logOutIP === '106.51.80.197' || logOutIP === '223.233.82.214') {
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
                console.log(false)
                setShowToastr2(true)
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
                <Transition appear show={isOpen} as={Fragment}>
                    <Dialog
                        as="div"
                        className="fixed inset-0 z-10 overflow-y-auto"
                        onClose={closeModal}
                    >
                        <div className="min-h-screen px-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Dialog.Overlay className="fixed inset-0" />
                            </Transition.Child>

                            {/* This element is to trick the browser into centering the modal contents. */}
                            <span
                                className="inline-block h-screen align-middle"
                                aria-hidden="true"
                            >
                                &#8203;
                            </span>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <p>Login</p>
                                            <XCircleIcon onClick={() => setIsOpen(false)} className="h-6 w-6 hover:text-red-500 cursor-pointer" />
                                        </div>
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <div className="bg-black rounded-md h-[300px] w-[400px]">
                                            <Webcam
                                                id="webcamera"
                                                className="rounded-md"
                                                audio={false}
                                                height={720}
                                                ref={webcamref}
                                                screenshotFormat="image/jpeg"
                                                width={1280}
                                                videoConstraints={{
                                                    width: 640,
                                                    height: 480,
                                                    facingMode: "user"
                                                }}
                                            />
                                            <img src={webcam} id="image" className="h-[300px] w-[400px] rounded-md hidden" />
                                        </div>
                                        <input onChange={(e) => setRole(e.target.value)} type="text" className="border my-2 w-full rounded-md px-4 py-2 focus:outline-none focus:border-orange-500" />
                                    </div>

                                    <div className="mt-2">
                                        {webcam == "" ? <>
                                            <button
                                                type="button"
                                                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-orange-900 bg-orange-100 border border-transparent rounded-md hover:bg-orange-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500"
                                                onClick={capture}
                                            >
                                                Capture Photo
                                            </button>
                                        </> : <>
                                            <button
                                                type="button"
                                                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-orange-900 bg-orange-100 border border-transparent rounded-md hover:bg-orange-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500"
                                                onClick={() => recapture()}
                                            >
                                                ReCapture Photo
                                            </button>
                                        </>}
                                        <button
                                            type="button"
                                            id="update"
                                            className="hidden ml-2 justify-center px-4 py-2 text-sm font-medium text-orange-900 bg-orange-100 border border-transparent rounded-md hover:bg-orange-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500"
                                            onClick={() => updateLoginStatus()}
                                        >
                                            Update
                                        </button>
                                    </div>
                                    {showToastr ? <>
                                        <div>
                                            <p className="bg-red-200 mt-5 p-5 rounded-2xl text-red-600 text-center font-medium">IP address does not match</p>
                                        </div>
                                    </> : null}
                                </div>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition>
                <Transition appear show={isOpen2} as={Fragment}>
                    <Dialog
                        as="div"
                        className="fixed inset-0 z-10 overflow-y-auto"
                        onClose={closeModal}
                    >
                        <div className="min-h-screen px-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Dialog.Overlay className="fixed inset-0" />
                            </Transition.Child>

                            {/* This element is to trick the browser into centering the modal contents. */}
                            <span
                                className="inline-block h-screen align-middle"
                                aria-hidden="true"
                            >
                                &#8203;
                            </span>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <p>LogOut</p>
                                            <XCircleIcon onClick={() => setIsOpen2(false)} className="h-6 w-6 hover:text-red-500 cursor-pointer" />
                                        </div>
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <div className="bg-black rounded-md h-[300px] w-[400px]">
                                            <Webcam
                                                id="webcamera"
                                                className="rounded-md"
                                                audio={false}
                                                height={720}
                                                ref={webcamref}
                                                screenshotFormat="image/jpeg"
                                                width={1280}
                                                videoConstraints={{
                                                    width: 640,
                                                    height: 480,
                                                    facingMode: "user"
                                                }}
                                            />
                                            <img src={webcam} id="image" className="h-[300px] w-[400px] rounded-md hidden" />
                                        </div>
                                        <input onChange={(e) => setOnboarding(e.target.value)} placeholder="No of Onboarding" min="0" type="number" className="border my-2 w-full rounded-md px-4 py-2 focus:outline-none focus:border-orange-500" />
                                        <input onChange={(e) => setProctoring(e.target.value)} placeholder="No of Proctoring" min="0" type="number" className="border my-2 w-full rounded-md px-4 py-2 focus:outline-none focus:border-orange-500" />
                                        <input onChange={(e) => setCalls(e.target.value)} placeholder="No of Calls" min="0" type="number" className="border my-2 w-full rounded-md px-4 py-2 focus:outline-none focus:border-orange-500" />
                                        <input onChange={(e) => setChats(e.target.value)} placeholder="No of Chats" type="number" min="0" className="border my-2 w-full rounded-md px-4 py-2 focus:outline-none focus:border-orange-500" />
                                        <input onChange={(e) => setTech(e.target.value)} placeholder="No of Tech" type="number" min="0" className="border my-2 w-full rounded-md px-4 py-2 focus:outline-none focus:border-orange-500" />
                                        <textarea rows="5" onChange={(e) => setOther(e.target.value)} placeholder="Anything Else Other than the above mentioned Role." type="text" className="resize-none border my-2 w-full rounded-md px-4 py-2 focus:outline-none focus:border-orange-500" />
                                    </div>

                                    <div className="mt-2">
                                        {webcam == "" ? <>
                                            <button
                                                type="button"
                                                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-orange-900 bg-orange-100 border border-transparent rounded-md hover:bg-orange-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500"
                                                onClick={capture}
                                            >
                                                Capture Photo
                                            </button>
                                        </> : <>
                                            <button
                                                type="button"
                                                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-orange-900 bg-orange-100 border border-transparent rounded-md hover:bg-orange-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500"
                                                onClick={() => recapture()}
                                            >
                                                ReCapture Photo
                                            </button>
                                        </>}
                                        <button
                                            type="button"
                                            id="update"
                                            className="hidden ml-2 justify-center px-4 py-2 text-sm font-medium text-orange-900 bg-orange-100 border border-transparent rounded-md hover:bg-orange-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500"
                                            onClick={() => updateLogoutStatus()}
                                        >
                                            Update
                                        </button>
                                    </div>
                                    {showToastr2 ? <>
                                        <div>
                                            <p className="bg-red-200 mt-5 p-5 rounded-2xl text-red-600 text-center font-medium">IP address does not match</p>
                                        </div>
                                    </> : null}
                                </div>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition>
            </div>
        </>
    )
}
