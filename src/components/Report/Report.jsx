import React, { useState, useEffect } from 'react'
import Moment from 'moment'
import axios from 'axios'

import "@ui5/webcomponents/dist/Button"
import { LineChart } from '@ui5/webcomponents-react-charts/lib/next/LineChart'



function Report() {
    const url = process.env.REACT_APP_CHECKINAPI
    
    const [dates, setDates] = useState([])
    const [measures, setMeasures ] = useState([])
    const [occupied,setOccupied] = useState([])
    

    useEffect(() => {
        axios.get(`${url}OccupiedCapacity?$orderby=date asc`)
        .then(resp => {
            let officesArray = []
            let mArray = []
            let dDates = []
            let datesArray = []
            const chartData = resp.data.value.map((item) => {
                if( !officesArray.includes(item.officeFloor)){
                    officesArray.push(item.officeFloor)
                    mArray.push({
                        accessor : item.officeFloor,
                        label : item.officeFloor
                    })
                }
                item[item.officeFloor] = item.OccupiedCapacity
                return item
            })
            dDates.push({
                accessor: 'date',
                formatter:  (d) => Moment(d).format('DD/MM/YYYY'),
                interval: 0
            })
            setDates(dDates)
            setMeasures(mArray)
            setOccupied(chartData)         
        })
    }, [])
    return (
        <LineChart
            style={{ width: '100%' }}
            dataset={occupied}
            dimensions={dates}
            measures={measures}
        />
    )
}

export default Report