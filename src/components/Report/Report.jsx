import React, { useState, useEffect, useRef } from 'react'
import Moment from 'moment'
import axios from 'axios'

import "@ui5/webcomponents/dist/Button"
import { LineChart } from '@ui5/webcomponents-react-charts/lib/next/LineChart'
import { Grid } from '@ui5/webcomponents-react/lib/Grid'


function Report() {
    const url = process.env.REACT_APP_CHECKINAPI

    const refFloor = useRef()

    const [dates, setDates] = useState([])
    const [measures, setMeasures] = useState([])
    const [occupied, setOccupied] = useState([])
    const [floors, setFloors] = useState([])
    const [floor, setFloor] = useState([])

    useEffect(() => {
        axios.get(`${url}ActiveFloors`)
            .then(resp => {
                setFloors(resp.data.value)
                setFloor(resp.data.value[0].ID)
            })
    }, [])

    useEffect(() => {
        axios.get(`${url}OccupiedCapacity?$filter=ID eq ${floor}&$orderby=date asc`)
            .then(resp => {
                let officesArray = []
                let mArray = []
                let dDates = []
                const chartData = resp.data.value.map((item) => {
                    if (!officesArray.includes(item.officeFloor)) {
                        officesArray.push(item.officeFloor)
                        mArray.push({
                            accessor: item.officeFloor,
                            label: item.officeFloor
                        })
                    }
                    item[item.officeFloor] = item.OccupiedCapacity
                    return item
                })
                dDates.push({
                    accessor: 'date',
                    formatter: (d) => Moment(d).format('DD/MM/YYYY'),
                    interval: 0
                })
                setDates(dDates)
                setMeasures(mArray)
                setOccupied(chartData)
            })
    }, [floor])

    //on floor change
    useEffect(() =>{
        refFloor.current.addEventListener('change', (event) => {
            setFloor(event.target.options[event.target._selectedIndex].value)
        })
        return () =>{
            refFloor.current.removeEventListener('change', (event) => {
                setFloor(event.target.options[event.target._selectedIndex].value)
            })
        }
    })

    return (
        <div>
            <Grid defaultSpan="XL12 L12 M12 S12">
                <div>
                    <ui5-label style={{ width: '100%' }} className="Labels" id="lblLocalidade" for="localidade" required>Andar: </ui5-label>
                    <ui5-select style={{ width: '100%' }} ref={refFloor} value={floor} class="select" id="localidade">
                        {
                            floors.map(optFloors => {
                                if (optFloors.ID === floor) {
                                    return (
                                        <ui5-option key={optFloors.ID} value={optFloors.ID} selected>{optFloors.name}</ui5-option>
                                    )
                                } else {
                                    return (
                                        <ui5-option key={optFloors.ID} value={optFloors.ID}>{optFloors.name}</ui5-option>
                                    )
                                }
                            })
                        }
                    </ui5-select>
                </div>
            </Grid>
            <LineChart
                style={{ width: '100%' }}
                dataset={occupied}
                dimensions={dates}
                measures={measures}
            />
        </div>
    )
}

export default Report