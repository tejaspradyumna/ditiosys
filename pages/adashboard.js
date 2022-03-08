import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import Header from '../components/Header'
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { InformationCircleIcon } from '@heroicons/react/solid'
import Link from 'next/link'

import * as credentials from '/config'

export default function Dashboard() {

    const [table, setTable] = useState("")

    useEffect(() => {
        const log = localStorage.getItem('log')
        if (!log) {
            window.location.href = "https://ditiosys.com/"
        }
    })

    useEffect(() => {
        async function getEmpDetails() {
            const res = await fetch(`${credentials.API_URL}/api/ditiosys/getEmpDetails`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            })
            const data = await res.json()
            console.log(data)
            setTable(data.record)
        }
        getEmpDetails()
    }, [])

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
                let optionsTime = { hour: 'numeric', minute: 'numeric' };
                const time = new Date(row.logintimeStamp).toLocaleString('en-US', optionsTime)
                return (
                    <p>{time}</p>
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
                let optionsTime = { hour: 'numeric', minute: 'numeric' };
                const time = new Date(row.logouttimeStamp).toLocaleString('en-US', optionsTime)
                return (
                    <p>{time}</p>
                )
            },
            sortable: true,
        },
        {
            name: "Role",
            selector: row => row.role,
            sortable: true,
        },
        {
            name: "Actions",
            cell: row => {
                return (
                    <Link href={`/logInfo?id=${row.id}&&eod=${row.eod}&&date=${row.logintimeStamp}&&status=${row.status}`} as={`/logInfo`}>
                        <InformationCircleIcon className="h-6 w-6 cursor-pointer hover:text-orange-500" />
                    </Link>
                )
            },
            sortable: true,
        },
    ];

    const tableData = [
        columns,
        table
    ]

    return (
        <>
            <div className="bg-gray-300 min-h-screen">
                <Header />
                <div className="bg-white max-w-[96%] mx-auto shadow-xl rounded-2xl mt-2 p-5">
                    {/* <DataTableExtensions {...tableData}> */}
                    <DataTable
                        columns={columns}
                        data={table}
                        noHeader
                        defaultSortField="id"
                        defaultSortAsc={false}
                        pagination
                        // customStyles={credentials.customStyles}
                        paginationRowsPerPageOptions={[10, 25, 50, 100]}
                    />
                    {/* </DataTableExtensions> */}
                </div>
            </div>
        </>
    )
}
