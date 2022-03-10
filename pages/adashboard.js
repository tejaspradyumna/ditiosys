import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import Header from '../components/Header'
import { Dialog, Transition } from '@headlessui/react'
import { XCircleIcon } from '@heroicons/react/outline'
import DataTable from "react-data-table-component";
// import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
// import { InformationCircleIcon } from '@heroicons/react/solid'
// import Link from 'next/link'
import * as XLSX from 'xlsx'
import DatePicker from "react-datepicker";
import * as toastr from 'toastr'

import "react-datepicker/dist/react-datepicker.css";

import * as credentials from '/config'

export default function Dashboard() {

    const [table, setTable] = useState("")
    const [isOpen, setIsOpen] = useState(false)

    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

    const [epid, setEpid] = useState("")

    console.log("Start Date - " + dateRange[0])
    console.log("End Date - " + dateRange[1])


    useEffect(() => {
        const log = localStorage.getItem('log')
        if (!log) {
            window.location.href = "https://ditiosys.com/"
        }
    })

    useEffect(() => {
        getEmpDetails()
    }, [])

    function closeModal() {
        setIsOpen(false)
    }

    async function getEmpDetails() {
        const res = await fetch(`${credentials.API_URL}/api/ditiosys/getEmpDetails`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        })
        const data = await res.json()
        setTable(data.record)
    }

    const columns = [
        {
            name: "Id",
            selector: row => row.id,
            sortable: true
        },
        {
            name: "EP ID",
            selector: row => row.epid,
            sortable: true
        },
        {
            name: "Date",
            cell: row => {
                let optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
                let optionsTime = { hour: 'numeric', minute: 'numeric' };
                const newdate = new Date(row.logintimeStamp).toLocaleString('en-GB', optionsDate)
                const time = new Date(row.logintimeStamp).toLocaleString('en-US', optionsTime)
                return (
                    <p>{newdate}</p>
                )
            },
            sortable: true,
        },
        {
            name: "LogIn IP",
            selector: row => row.loginip,
            sortable: true,
        },
        {
            name: "LogIn Time",
            cell: row => {
                let optionsTime = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
                const time = new Date(row.logintimeStamp).toLocaleString('en-US', optionsTime)
                const tooltip = new Date(row.logintimeStamp)
                return (
                    <p title={tooltip}>{time}</p>
                )
            },
            sortable: true,
        },
        {
            name: "LogOut IP",
            selector: row => row.logoutip,
            sortable: true,
        },
        {
            name: "LogOut Time",
            cell: row => {
                let optionsTime = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
                const time = new Date(row.logouttimeStamp).toLocaleString('en-US', optionsTime)
                const tooltip = new Date(row.logouttimeStamp)
                return (
                    <p title={tooltip}>{time}</p>
                )
            },
            sortable: true,
        },
        {
            name: "Total Break Time",
            cell: row => {
                const BreakFunction = () => {
                    const [breakData, setBreakData] = useState("")
                    const [breakTime, setBreakTime] = useState("")
                    useEffect(() => {
                        async function getBreakDetails() {
                            const id = row.id
                            const res = await fetch(`${credentials.API_URL}/api/ditiosys/getBreakDetails`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ id })
                            })
                            const breakData = await res.json()
                            setBreakData(breakData.record)
                            let breakTime = 0;
                            breakData.record.forEach((row1) => {
                                const time = (new Date(row1.end) - new Date(row1.start)) / 1000
                                breakTime = breakTime + time
                                setBreakTime(breakTime)
                            })
                        }
                        getBreakDetails()
                    }, [])
                    const h = Math.floor(breakTime / 3600);
                    const m = Math.floor(breakTime % 3600 / 60);
                    const s = Math.floor(breakTime % 3600 % 60);
                    if (h < 10) {
                        h = "0" + h;
                    }
                    if (m < 10) {
                        m = "0" + m;
                    }
                    if (s < 10) {
                        s = "0" + s;
                    }

                    return (
                        <>
                            <p>{h} : {m} : {s}</p>
                        </>
                    )
                }
                BreakFunction()
            },
            sortable: true,
        },
        {
            name: "Active Time",
            cell: row => {
                const BreakFunction = () => {
                    const [breakData, setBreakData] = useState("")
                    const [breakTime, setBreakTime] = useState("")
                    const logTime = (new Date(row.logouttimeStamp) - new Date(row.logintimeStamp)) / 1000
                    const activeTime = logTime - breakTime
                    useEffect(() => {
                        async function getBreakDetails() {
                            const id = row.id
                            const res = await fetch(`${credentials.API_URL}/api/ditiosys/getBreakDetails`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ id })
                            })
                            const breakData = await res.json()
                            setBreakData(breakData.record)
                            let breakTime = 0;
                            breakData.record.forEach((row1) => {
                                const time = (new Date(row1.end) - new Date(row1.start)) / 1000
                                breakTime = breakTime + time
                                setBreakTime(breakTime)
                            })
                        }
                        getBreakDetails()
                    }, [])
                    const h = Math.floor(activeTime / 3600);
                    const m = Math.floor(activeTime % 3600 / 60);
                    const s = Math.floor(activeTime % 3600 % 60);
                    if (h < 10) {
                        h = "0" + h;
                    }
                    if (m < 10) {
                        m = "0" + m;
                    }
                    if (s < 10) {
                        s = "0" + s;
                    }

                    return (
                        <>
                            <p>{h} : {m} : {s}</p>
                        </>
                    )
                }
                BreakFunction()
            },
            sortable: true,
        },
        {
            name: "Role",
            selector: row => row.role,
            sortable: true,
        },
        {
            name: "Onboarding",
            cell: row => {
                const eodCount = JSON.parse(row.eod)
                return (<p>{eodCount.onboarding}</p>)
            },
            sortable: true,
        },
        {
            name: "Proctoring",
            cell: row => {
                const eodCount = JSON.parse(row.eod)
                return (<p>{eodCount.proctoring}</p>)
            },
            sortable: true,
        },
        {
            name: "Calls",
            cell: row => {
                const eodCount = JSON.parse(row.eod)
                return (<p>{eodCount.calls}</p>)
            },
            sortable: true,
        },
        {
            name: "Chats",
            cell: row => {
                const eodCount = JSON.parse(row.eod)
                return (<p>{eodCount.chats}</p>)
            },
            sortable: true,
        },
        {
            name: "Tech",
            cell: row => {
                const eodCount = JSON.parse(row.eod)
                return (<p>{eodCount.tech}</p>)
            },
            sortable: true,
        },
        {
            name: "Other Roles",
            cell: row => {
                const eodCount = JSON.parse(row.eod)
                return (<p>{eodCount.other}</p>)
            },
            sortable: true,
        },
        // {
        //     name: "Actions",
        //     cell: row => {
        //         return (
        //             <Link href={`/logInfo?id=${row.id}&&eod=${row.eod}&&date=${row.logintimeStamp}&&status=${row.status}`} as={`/logInfo`}>
        //                 <InformationCircleIcon className="h-6 w-6 cursor-pointer hover:text-orange-500" />
        //             </Link>
        //         )
        //     },
        //     sortable: true,
        // },
    ];

    const tableData = [
        columns,
        table
    ]

    async function exportDatatoExcel() {
        let exportData = []
        let index = 1

        const startingDate = dateRange[0]
        const endingDate = dateRange[1]

        let flag
        const res = await fetch(`${credentials.API_URL}/api/ditiosys/getEmpDetails`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ flag, startingDate, endingDate, epid })
        })
        const data = await res.json()
        if (data.message === "Records Found") {
            const dataIndex = data.record.length
            data.record.forEach((row) => {
                async function getBreakDetails() {
                    const id = row.id
                    let breakTime = 0
                    const res1 = await fetch(`${credentials.API_URL}/api/ditiosys/getBreakDetails`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id })
                    })
                    const breakData = await res1.json()
                    breakData.record.forEach((row1) => {
                        const time = (new Date(row1.end) - new Date(row1.start)) / 1000
                        breakTime = breakTime + time
                    })
                    let optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
                    let optionsTime = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
                    const newdate = new Date(row.logintimeStamp).toLocaleString('en-GB', optionsDate)
                    const logintime = new Date(row.logintimeStamp).toLocaleString('en-US', optionsTime)
                    const logouttime = new Date(row.logouttimeStamp).toLocaleString('en-US', optionsTime)
                    const totalHours = (new Date(row.logouttimeStamp) - new Date(row.logintimeStamp)) / 1000
                    // console.log(totalHours)
                    const activeHours = totalHours - breakTime
                    // console.log(activeHours)
                    let bh = Math.floor(breakTime / 3600);
                    let bm = Math.floor(breakTime % 3600 / 60);
                    let bs = Math.floor(breakTime % 3600 % 60);
                    if (bh < 10) {
                        bh = "0" + bh;
                    }
                    if (bm < 10) {
                        bm = "0" + bm;
                    }
                    if (bs < 10) {
                        bs = "0" + bs;
                    }

                    let hh = Math.floor(activeHours / 3600);
                    let hm = Math.floor(activeHours % 3600 / 60);
                    let hs = Math.floor(activeHours % 3600 % 60);
                    if (hh < 10) {
                        hh = "0" + hh;
                    }
                    if (hm < 10) {
                        hm = "0" + hm;
                    }
                    if (hs < 10) {
                        hs = "0" + hs;
                    }

                    const reocrd = {
                        slno: index++,
                        id: id,
                        epid: row.epid,
                        date: newdate,
                        loginIP: row.loginip,
                        loginTime: logintime,
                        logoutIP: row.logoutip,
                        logoutTime: logouttime,
                        totalBreak: bh + ":" + bm + ":" + bs,
                        activeHours: hh + ":" + hm + ":" + hs,
                        role: row.role,
                    }
                    exportData.push(reocrd)
                }
                getBreakDetails()
            })

            var x = setInterval(() => {
                if (dataIndex === exportData.length) {
                    console.log(exportData)
                    const convertJsontoExcel = () => {
                        const workSheet = XLSX.utils.json_to_sheet(exportData);
                        const workBook = XLSX.utils.book_new();

                        XLSX.utils.book_append_sheet(workBook, workSheet, "employee")
                        // Generate buffer
                        XLSX.write(workBook, { bookType: 'xlsx', type: "buffer" })

                        // Binary string
                        XLSX.write(workBook, { bookType: "xlsx", type: "binary" })

                        XLSX.writeFile(workBook, "emplog.xlsx")
                    }
                    convertJsontoExcel()
                    clearInterval(x)
                    setDateRange([null, null])
                    setEpid("")
                    setIsOpen(false)
                }
            }, 1000)

        } else {
            toastr.error(data.message)
            console.log(data.message)
        }
    }

    const ExpandedComponent = ({ data }) => {
        const [breakData, setBreakData] = useState("")
        useEffect(() => {
            const id = data.id
            async function getBreakDetails() {
                const res = await fetch(`${credentials.API_URL}/api/ditiosys/getBreakDetails`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id })
                })
                const breakData = await res.json()
                setBreakData(breakData.record)
            }
            getBreakDetails()
        }, [])

        const breakColumns = [
            {
                name: "Start Time",
                cell: row => {
                    let optionsTime = { hour: 'numeric', minute: 'numeric' };
                    const time = new Date(row.start).toLocaleString('en-US', optionsTime)
                    return (
                        <p>{time}</p>
                    )
                },
                sortable: true,
            },
            {
                name: "End Time",
                cell: row => {
                    let optionsTime = { hour: 'numeric', minute: 'numeric' };
                    const time = new Date(row.end).toLocaleString('en-US', optionsTime)
                    return (
                        <p>{time}</p>
                    )
                },
                sortable: true,
            },
            {
                name: "Time",
                cell: row => {
                    const time = (new Date(row.end) - new Date(row.start)) / 1000
                    const h = Math.floor(time / 3600);
                    const m = Math.floor(time % 3600 / 60);
                    const s = Math.floor(time % 3600 % 60);
                    if (h < 10) {
                        h = "0" + h;
                    }
                    if (m < 10) {
                        m = "0" + m;
                    }
                    if (s < 10) {
                        s = "0" + s;
                    }
                    return (
                        <p>{h} : {m} : {s}</p>
                    )
                },
                sortable: true,
            },
        ];

        return (
            <>
                <div className="ml-7">
                    <DataTable
                        columns={breakColumns}
                        data={breakData}
                        noHeader
                        defaultSortField="id"
                        defaultSortAsc={false}
                        pagination
                        // customStyles={credentials.customStyles}
                        paginationRowsPerPageOptions={[10, 25, 50, 100]}
                    />
                </div>
            </>
        )
    };

    return (
        <>
            <div className="bg-gray-300 min-h-screen pb-2">
                <Header />
                <div className="bg-white max-w-[96%] mx-auto shadow-xl rounded-2xl my-2 p-5">
                    {/* <DataTableExtensions {...tableData}> */}
                    <button onClick={() => exportDatatoExcel()} className="inline-flex justify-center px-4 py-2 text-sm font-medium text-orange-900 bg-orange-100 border border-transparent rounded-md hover:bg-orange-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500">Export</button>
                    <DataTable
                        columns={columns}
                        data={table}
                        noHeader
                        defaultSortField="id"
                        defaultSortAsc={false}
                        pagination
                        expandableRows
                        responsive
                        expandOnRowClicked
                        expandableRowsHideExpander
                        expandableRowsComponent={ExpandedComponent}
                        // customStyles={credentials.customStyles}
                        paginationRowsPerPageOptions={[10, 25, 50, 100]}
                    />
                    {/* </DataTableExtensions> */}
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
                                            <p>Export</p>
                                            <XCircleIcon onClick={() => setIsOpen(false)} className="h-6 w-6 hover:text-red-500 cursor-pointer" />
                                        </div>
                                    </Dialog.Title>
                                    <div className="mt-2 flex flex-col items-center justify-between">
                                        <DatePicker
                                            selectsRange={true}
                                            startDate={startDate}
                                            endDate={endDate}
                                            onChange={(update) => {
                                                setDateRange(update);
                                            }}
                                            inline
                                            isClearable={true}
                                        />
                                        <input onChange={(e) => setEpid(e.target.value)} text="text" placeholder="EPID" className="border my-2 w-full rounded-md px-4 py-2 focus:outline-none focus:border-orange-500" />
                                        <button onClick={() => exportDatatoExcel()} className="inline-flex justify-center px-4 py-2 text-sm font-medium text-orange-900 bg-orange-100 border border-transparent rounded-md hover:bg-orange-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500">Export</button>
                                    </div>
                                </div>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition>
            </div>
        </>
    )
}
