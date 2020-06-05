import React, { useState, useRef, useEffect } from 'react'
import Moment from 'moment'
import axios from 'axios'

import "@ui5/webcomponents/dist/Button"
import { LineChart } from '@ui5/webcomponents-react-charts/lib/next/LineChart'


const url = 'http://localhost:4004/catalog/'
function Report() {

    const [occupied, setOccupied] = useState([])

    useEffect(() => {
        axios.get(`${url}OccupiedCapacity`)
        .then(resp => {
            let chartData = resp.data.value.map((item) => {
                return {
                    date : Moment(item.date).format('DD/MM/YYYY'),
                    officeFloor : item.officeFloor,
                    OccupiedCapacity : item.OccupiedCapacity
                }
            })
            
            setOccupied(resp.data.value)
        })
    }, [])
    return (
        <LineChart
            style={{ width: '100%' }}
            dataset={occupied}
            dimensions={[
                {
                    accessor: 'date',
                    formatter: (d) => Moment(d).format('DD/MM/YYYY'),
                    interval: 0
                }
            ]}
            measures={[
                {
                    accessor: 'officeFloor',
                    label: 'Escritório - Andar'
                },
                {
                    accessor : 'OccupiedCapacity',
                    label: 'Capacidade Ocupada'
                }
            ]}
        />
    )
}

export default Report