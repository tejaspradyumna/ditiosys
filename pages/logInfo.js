import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Header from '../components/Header'
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";

import * as credentials from '/config'

export default function LogInfo() {
    const router = useRouter()
    const [id, setId] = useState(router.query.id)
    const [eod, setEod] = useState(router.query.eod)
    let optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = useState(new Date(router.query.date).toLocaleString('en-GB', optionsDate))
    const status = useState(router.query.status)
    const [eodData, setEodData] = useState("")

    const [table, setTable] = useState("")
    // const logDate = date.toLocaleString('en-US', optionsDate)

    useEffect(() => {
        async function getBreakDetails() {
            const res = await fetch(`${credentials.API_URL}/api/ditiosys/getBreakDetails`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            })
            const data = await res.json()
            console.log(data)
            setTable(data.record)
            setEodData(JSON.parse(eod[0]))
        }
        getBreakDetails()
    }, [])

    const columns = [
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
                console.log(time)
                const h = Math.floor(time / 3600);
                const m = Math.floor(time % 3600 / 60);
                const s = Math.floor(time % 3600 % 60);
                console.log(m)
                console.log(s)
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

    const tableData = [
        columns,
        table
    ]

    return (
        <>
            <div className="bg-gray-300 min-h-screen">
                <Header />
                <div className="grid grid-cols-12 gap-2 max-w-[96%] mx-auto">
                    <div className={`bg-white col-span-8 shadow-xl rounded-2xl mt-2 p-5`}>
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
                    <div className="bg-white col-span-4 shadow-xl rounded-2xl mt-2 p-5">
                        <p className="text-center font-bold">{date}</p>
                        <p className="font-bold">No Of Onboarding : <span className="font-medium">{eodData.onboarding}</span></p>
                        <p className="font-bold">No Of Proctoring : <span className="font-medium">{eodData.proctoring}</span></p>
                        <p className="font-bold">No Of Calls : <span className="font-medium">{eodData.calls}</span></p>
                        <p className="font-bold">No Of Chats : <span className="font-medium">{eodData.chats}</span></p>
                        <p className="font-bold">No Of Tech : <span className="font-medium">{eodData.tech}</span></p>
                        <p>{eodData.other}</p>
                    </div>
                </div>
            </div>
        </>
    )
}
