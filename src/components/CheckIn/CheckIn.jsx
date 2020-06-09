import React, { useState, useRef, useEffect } from 'react'
import Moment from 'moment'

import "@ui5/webcomponents/dist/Button"
import "@ui5/webcomponents/dist/Select"
import "@ui5/webcomponents/dist/Option"
import "@ui5/webcomponents/dist/DatePicker"
import "@ui5/webcomponents/dist/Label"
import "@ui5/webcomponents/dist/Title"
import "@ui5/webcomponents-icons/dist/icons/cancel"
import "@ui5/webcomponents/dist/Toast"


import { Grid } from '@ui5/webcomponents-react/lib/Grid'

import "@ui5/webcomponents/dist/Table"
import "@ui5/webcomponents/dist/TableColumn"
import "@ui5/webcomponents/dist/TableRow"
import "@ui5/webcomponents/dist/TableCell"
import "@ui5/webcomponents/dist/Switch"

import axios from 'axios'

import { msalAuth } from '../../msal/MsalAuthProvider'
import { getUserDetails } from '../../graph/GraphService'

import './CheckIn.css'

function CheckIn() {
    const url = process.env.REACT_APP_CHECKINAPI

    const refOffice = useRef()
    const refFloor = useRef()
    const refDate = useRef()

    const [offices, setOffices] = useState([])
    const [floors, setFloors] = useState([])
    const [checkIns, setCheckIns] = useState([])

    const [office, setOffice] = useState()
    const [floor, setFloor] = useState()
    const [date, setDate] = useState()
    const [user, setUser] = useState()
    const [availability, setAvailability] = useState()
    const [toastMsg,setToastMsg] = useState()

    var getUser = async () => {
        try {
            const accessTokenRequest = {
                scopes: ["user.read"]
            }
            var accessToken = null
            try {
                accessToken = await msalAuth.acquireTokenSilent(accessTokenRequest)
            }
            catch (error) {
                accessToken = await msalAuth.acquireTokenPopup(accessTokenRequest)
            }

            if (accessToken) {
                var user = await getUserDetails(accessToken)
                setUser({
                    user:user,
                    isLoading: false,
                    error: null
                })

            }
            else {
                setUser({
                    user:null,
                    isLoading: false,
                    error: 'No Access Token...'
                })
            }
        }
        catch (err) {
            var error = {}
            if (typeof (err) === 'string') {
                var errParts = err.split('|')
                error = errParts.length > 1 ?
                    { message: errParts[1], debug: errParts[0] } :
                    { message: err }
            } else {
                error = {
                    message: err.message,
                    debug: JSON.stringify(err)
                }
            }
            setUser({
                user:{},
                isLoading: false,
                error: error
            })
        }
    }

    var getCheckIns = (userID) => {
        axios.get(`${url}CheckinAppList?$filter=user eq '${userID}'&$orderby=ID desc`)
            .then(resp => {
                setCheckIns(resp.data.value)
            })
    }

    var getOffices = () => {
        axios.get(`${url}ActiveOffices`)
            .then(resp => { 
                setOffices(resp.data.value)
                setOffice(resp.data.value[0].ID)
            })
    }

    var getAvailability = (availableDate, availableFloor) => {
        if(availableDate !== undefined && availableFloor !== undefined){
            axios.get(`${url}AvailableCapacity?$filter=date eq ${Moment(availableDate).format('YYYY-DD-MM')} and ID eq ${availableFloor}`)
                .then(resp => {
                    if (resp.data.value.length > 0){
                        setAvailability(resp.data.value[0].AvailableCapacity)
                    }else{
                        getFloorCapacity(availableFloor)
                    }
                })
        }
        
    }

    var getFloorCapacity = floorCapacity => {
        axios.get(`${url}ActiveFloors?$filter=ID eq ${floorCapacity}`)
                .then(resp => {
                    setAvailability(resp.data.value[0].capacity)
                })
    }

    var getFloors = officeFloor => {
        if (officeFloor !== undefined){
            axios.get(`${url}ActiveFloors?$filter=office_ID eq ${officeFloor}`)
                .then(resp => {
                    setFloors(resp.data.value)
                    setFloor(resp.data.value[0].ID)
                })
        }
    }

    var create = () => {
        axios.post(`${url}CheckIn`, {
            user : {ID: user.user.id, name: user.user.displayName, email: user.user.mail},
            office_ID :  +office,
            floor_ID : +floor,
            date : Moment(date).format('YYYY-DD-MM'),
            active : 1
        }).then(resp => {
            getCheckIns(user.user.id)
            getAvailability(Moment(date).format('YYYY-MM-DD'), +floor)

            setToastMsg('Check-in Realizado!')
            document.getElementById('wcToastBasic').show()
        }).catch((error) => {
            if (error.response.data.error.code === "400"){
                setToastMsg(error.response.data.error.message)
            }else{
                setToastMsg('Erro ao inserir o check-in, Tente novamente em alguns instantes.')
            }
            
            document.getElementById('wcToastBasic').show()
        })
    }

    var getMaxDate = () => {
        var d = new Date()
        d.setDate(d.getDate() + 5)
        return d.toLocaleDateString('PT')
    }

    var cancel = (checkInId) => {
        axios.delete(`${url}CheckIn/${checkInId}`)
            .then((resp) => {
                getCheckIns(user.user.id)
                if (date !== undefined) {
                    getAvailability(Moment(date).format('YYYY-MM-DD'), +floor)
                }

                setToastMsg('Check-in Cancelado')
                document.getElementById('wcToastBasic').show()
            })
    }   

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

    //on Office change
    useEffect(() =>{
        refOffice.current.addEventListener('change', (event) => {
            setOffice(event.target.options[event.target._selectedIndex].value)
        })
        return () =>{
            refOffice.current.removeEventListener('change', (event) => {
                setOffice(event.target.options[event.target._selectedIndex].value)
            })
        }
    })

    useEffect(() => {
        getAvailability(date, floor)
    }, [date, floor])

    useEffect(() => {
        getFloors(office)
    }, [office])


    //onDate Change
    useEffect(() =>{
        refDate.current.addEventListener('change', (event) => {
            setDate(event.target.value)
        })
        return () =>{
            refDate.current.removeEventListener('change', (event) => {
                setDate(event.target.value)
            })
        }
    })

    //close message strip
    useEffect(() => {
        getUser()
        getOffices()
        
    }, [])

    useEffect(() => {
        if (user){
            getCheckIns(user.user.id)
        }
    }, [user])
    return (
        <div>
            <Grid className="CheckIn">
                <div>
                    <ui5-label style={{ width: '100%' }} className="Labels" id="lblEscritorio" for="escritorio" required>Escritório: </ui5-label>
                    <ui5-select style={{ width: '100%' }} value={office} ref={refOffice} class="select" id="escritorio" aria-required="true" aria-labelledby="myLabel3">
                        {
                            offices.map((optOffice) => {
                                return (
                                    <ui5-option key={optOffice.ID} value={optOffice.ID}>{optOffice.name}</ui5-option>
                                )
                            })
                        }
                    </ui5-select>
                </div>
                <div>
                    <ui5-label style={{ width: '100%' }} className="Labels" id="lblLocalidade" for="localidade" required>Localidade: </ui5-label>
                    <ui5-select style={{ width: '100%' }} ref={refFloor} value={floor} class="select" id="localidade">
                        {
                            floors.map(optFloors => {
                                if (optFloors.ID === floor){
                                    return (
                                        <ui5-option key={optFloors.ID} value={optFloors.ID} selected>{optFloors.name}</ui5-option>
                                    )
                                }else{
                                    return (
                                        <ui5-option key={optFloors.ID} value={optFloors.ID}>{optFloors.name}</ui5-option>
                                    )
                                }
                            })
                        }
                    </ui5-select>
                </div>
                <div>
                    <ui5-label style={{ width: '100%' }} className="Labels" id="lblData" for="data" required>Data: </ui5-label>
                    <ui5-datepicker style={{ width: '100%' }} ref={refDate} value={date} id="data" min-date={new Date().toLocaleDateString('PT')} max-date={getMaxDate()} format-pattern="dd/MM/yyyy"></ui5-datepicker>
                </div>
                <div style={{textAlign:"right"}}>
                    <br></br>
                    <ui5-label style={{ marginRight: '20px' }} className="Labels">{ availability !== undefined ? availability + ' Lugares Disponíveis' : ''}</ui5-label>
                    { availability !== undefined &&  availability > 0 ? <ui5-button design="Positive" onClick={create}>Check-in</ui5-button> : <ui5-button design="Positive" disabled>Check-in</ui5-button> }
                </div>
            </Grid>
            <Grid defaultSpan="XL12 L12 M12 S12">
                <div>
                    <ui5-title level="H4">Meus Agendamentos</ui5-title>
                </div>
                <div style={{ 'overflowX': 'auto' }}>
                    <ui5-table class="demo-table" no-data-text="Você não possui agendamentos!" show-no-data>
                        <ui5-table-column slot="columns">
                            <span>Escritório</span>
                        </ui5-table-column>

                        <ui5-table-column slot="columns" popin-text="Supplier">
                            <span>Localidade</span>
                        </ui5-table-column>

                        <ui5-table-column slot="columns" popin-text="Dimensions" demand-popin>
                            <span>Data</span>
                        </ui5-table-column>

                        <ui5-table-column slot="columns" popin-text="Weight" demand-popin>
                            <span>Cancelar</span>
                        </ui5-table-column>
                        {
                            checkIns.map((rowCheckIn, i ) => {
                                return (
                                    <ui5-table-row key={rowCheckIn.id}>
                                        <ui5-table-cell popin-text="Weight" demand-popin>
                                            <span>{rowCheckIn.officeName}</span>
                                        </ui5-table-cell>
                                        <ui5-table-cell popin-text="Weight" demand-popin>
                                            <span>{rowCheckIn.floorName}</span>
                                        </ui5-table-cell>
                                        <ui5-table-cell popin-text="Weight" demand-popin>
                                            <span>{Moment(rowCheckIn.date).format('DD/MM/YYYY')}</span>
                                        </ui5-table-cell>
                                        <ui5-table-cell popin-text="Weight" demand-popin>
                                            <span onClick={e => cancel(rowCheckIn.ID)}>
                                                <ui5-button icon="cancel" design="Negative" aria-labelledby="lblCancel"></ui5-button>
                                            </span>
                                        </ui5-table-cell>
                                    </ui5-table-row>
                                )
                            })
                        }
                    </ui5-table>
                </div>
            </Grid>
            <ui5-toast id="wcToastBasic">{toastMsg}</ui5-toast>
        </div>
        
    )
}

export default CheckIn

  