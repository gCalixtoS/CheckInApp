import React, { useState, useRef, useEffect } from 'react'
import Moment from 'moment'

import "@ui5/webcomponents/dist/Button"
import "@ui5/webcomponents/dist/Select"
import "@ui5/webcomponents/dist/Option"
import "@ui5/webcomponents/dist/DatePicker"
import "@ui5/webcomponents/dist/Label"
import "@ui5/webcomponents/dist/Title"
import "@ui5/webcomponents/dist/MessageStrip";

import { Grid } from '@ui5/webcomponents-react/lib/Grid';

import "@ui5/webcomponents/dist/Table";
import "@ui5/webcomponents/dist/TableColumn";
import "@ui5/webcomponents/dist/TableRow";
import "@ui5/webcomponents/dist/TableCell";
import "@ui5/webcomponents/dist/Switch";

import axios from 'axios'

import { msalAuth } from '../../msal/MsalAuthProvider'
import { getUserDetails } from '../../graph/GraphService'

import './CheckIn.css'

function CheckIn() {
    const url = 'http://localhost:4004/catalog/'

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
    const [inserted, setInserted] = useState(false)
    const [insertedError, setInsertedError] = useState(false)
    const [availability, setAvailability] = useState()

    var getUser = async () => {
        try {
            const accessTokenRequest = {
                scopes: ["user.read"]
            }
            var accessToken = null;
            try {
                accessToken = await msalAuth.acquireTokenSilent(accessTokenRequest);
            }
            catch (error) {
                accessToken = await msalAuth.acquireTokenPopup(accessTokenRequest);
            }

            if (accessToken) {
                var user = await getUserDetails(accessToken);
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
            var error = {};
            if (typeof (err) === 'string') {
                var errParts = err.split('|');
                error = errParts.length > 1 ?
                    { message: errParts[1], debug: errParts[0] } :
                    { message: err };
            } else {
                error = {
                    message: err.message,
                    debug: JSON.stringify(err)
                };
            }
            setUser({
                user:{},
                isLoading: false,
                error: error
            })
        }
    }

    var getCheckIns = (userID) => {
        axios.get(`${url}CheckinAppList?$filter=user eq '${userID}'`)
            .then(resp => {
                setCheckIns(resp.data.value.reverse())
            })
    }

    var getOffices = () => {
        axios.get(`${url}Offices`)
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
        axios.get(`${url}Floors?$filter=ID eq ${floorCapacity}`)
                .then(resp => {
                    setAvailability(resp.data.value[0].capacity)
                })
    }

    var getFloors = officeFloor => {
        if (officeFloor !== undefined){
            axios.get(`${url}Floors?$filter=office_ID eq ${officeFloor}`)
                .then(resp => {
                    setFloors(resp.data.value)
                    setFloor(resp.data.value[0].ID)
                })
        }
    }

    var create = () => {
        axios.post(`${url}CheckIn`, {
            user : {ID: user.user.id, name: user.user.displayName, email: user.user.mail},
            office : {ID : +office},
            floor : {ID : +floor},
            date : Moment(date).format('YYYY-DD-MM'),
            active : 1
        }).then(resp => {
            setInserted(true)
            getCheckIns(user.user.id)
            getAvailability(Moment(date).format('YYYY-MM-DD'), +floor)
        }).catch(error => {
            setInsertedError(true)
        })
    }

    var getMaxDate = () => {
        var d = new Date()
        d.setDate(d.getDate() + 5)
        return d.toLocaleDateString('PT')
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
        
        window.onload = () => {
            document.querySelectorAll("ui5-messagestrip").forEach(function(messageStrip) {
                messageStrip.addEventListener("close", function() {
                    messageStrip.parentNode.removeChild(messageStrip);
                });
            });

            getUser()
            getOffices()
        }
    });

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
                    <ui5-select value={office} ref={refOffice} class="select" id="escritorio" aria-required="true" aria-labelledby="myLabel3">
                        {
                            offices.map((optOffice) => {
                                return (
                                    <ui5-option id={optOffice.ID} value={optOffice.ID}>{optOffice.name}</ui5-option>
                                )
                            })
                        }
                    </ui5-select>
                </div>
                <div>
                    <ui5-label style={{ width: '100%' }} className="Labels" id="lblLocalidade" for="localidade" required>Localidade: </ui5-label>
                    <ui5-select ref={refFloor} value={floor} class="select" id="localidade">
                        {
                            floors.map(optFloors => {
                                if (optFloors.ID === floor){
                                    return (
                                        <ui5-option value={optFloors.ID} selected>{optFloors.name}</ui5-option>
                                    )
                                }else{
                                    return (
                                        <ui5-option value={optFloors.ID}>{optFloors.name}</ui5-option>
                                    )
                                }
                            })
                        }
                    </ui5-select>
                </div>
                <div>
                    <ui5-label style={{ width: '100%' }} className="Labels" id="lblData" for="data" required>Data: </ui5-label>
                    <ui5-datepicker ref={refDate} value={date} id="data" min-date={new Date().toLocaleDateString('PT')} max-date={getMaxDate()} format-pattern="dd/MM/yyyy"></ui5-datepicker>
                </div>
                <div>
                    <br></br>
                    <ui5-label style={{ marginRight: '20px' }} className="Labels">{ availability !== undefined ? availability + ' Lugares Disponíveis' : ''}</ui5-label>
                    <ui5-button onClick={create}>Check-in</ui5-button>
                </div>
            </Grid>
            <div>
                <ui5-messagestrip type="Positive" style={{display:inserted ? 'inline' : 'none'}}>Check-in Realizado!</ui5-messagestrip>
                <ui5-messagestrip type="Negative" style={{display:insertedError ? 'inline' : 'none'}}>Erro ao inserir o check-in, Tente novamente em alguns instantes.</ui5-messagestrip>
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

                        {/* <ui5-table-column slot="columns" popin-text="Weight" demand-popin>
                            <span>Ativo</span>
                        </ui5-table-column> */}
                        {
                            checkIns.map((rowCheckIn, i ) => {
                                return (
                                    <ui5-table-row>
                                        <ui5-table-cell popin-text="Weight" demand-popin>
                                            <span>{rowCheckIn.officeName}</span>
                                        </ui5-table-cell>
                                        <ui5-table-cell popin-text="Weight" demand-popin>
                                            <span>{rowCheckIn.floorName}</span>
                                        </ui5-table-cell>
                                        <ui5-table-cell popin-text="Weight" demand-popin>
                                            <span>{Moment(rowCheckIn.date).format('DD/MM/YYYY')}</span>
                                        </ui5-table-cell>
                                        {/* <ui5-table-cell popin-text="Weight" demand-popin>
                                            {
                                                rowCheckIn.active === 1 ? <ui5-switch graphical checked></ui5-switch> : <ui5-switch graphical></ui5-switch>
                                            }
                                        </ui5-table-cell> */}
                                    </ui5-table-row>
                                )
                            })
                        }
                    </ui5-table>
                </div>
            </div>
        </div>
        
    )
}

export default CheckIn