import React, { useRef, useState, useEffect } from 'react'
import { useSelector, shallowEqual } from "react-redux"
import axios from 'axios'

import "@ui5/webcomponents/dist/Table"
import "@ui5/webcomponents/dist/TableColumn"
import "@ui5/webcomponents/dist/TableRow"
import "@ui5/webcomponents/dist/TableCell"
import "@ui5/webcomponents-icons/dist/icons/add"
import "@ui5/webcomponents-icons/dist/icons/delete"

import { Dialog } from '@ui5/webcomponents-react/lib/Dialog'
import { Grid } from '@ui5/webcomponents-react/lib/Grid'
import { Title } from '@ui5/webcomponents-react/lib/Title'
import { Label } from '@ui5/webcomponents-react/lib/Label'
import { Input } from '@ui5/webcomponents-react/lib/Input'
import { Toast } from '@ui5/webcomponents-react/lib/Toast'
import { Button } from '@ui5/webcomponents-react/lib/Button'

function AdministratorsForm(props) {
    const url = process.env.REACT_APP_CHECKINAPI_ADM

    const { admintoken } = useSelector(state => ({
        admintoken: state.authToken.admintoken
    }), shallowEqual)

    const refEmail = useRef()
    const refName = useRef()
    const refFloor = useRef()

    const [name, setName] = useState()
    const [email, setEmail] = useState()

    const [floors, setFloors] = useState([])
    const [ floor, setFloor] = useState()
    const [securityGuardsFloors, setSecurityGuardsFloors] = useState([])

    const [toastMsg, setToastMsg] = useState()

    var edit = () => {
        axios.put(`${url}SecurityGuards/${props.administratorId}`, {
            name: name,
            email: email
        },{
            headers: {
                idtoken: admintoken
            }
        }).then(resp => {

            props.dialogRef.current.close()
            document.getElementById('toastAdministratorForm').show()
            props.doneCallback()
        }).catch((error) => {
            if (error.response.data.error.code === "400") {
                setToastMsg(error.response.data.error.message)
            }

            document.getElementById('toastAdministratorForm').show()
        })
    }

    var create = () => {
        axios.post(`${url}SecurityGuards`, {
            name: name,
            email: email,
            active: 1
        },{
            headers: {
                idtoken: admintoken
            }
        }).then(resp => {
            setName('')
            setEmail('')

            props.dialogRef.current.close()
            document.getElementById('toastAdministratorForm').show()
            props.doneCallback()
        }).catch((error) => {
            if (error.response.data.error.code === "400") {
                setToastMsg(error.response.data.error.message)
            } else {
                setToastMsg('Erro ao inserir o escritório, Tente novamente em alguns instantes.')
            }

            document.getElementById('toastAdministratorForm').show()
        })
    }

    var addFloor = () => {
        axios.post(`${url}FloorSecurityGuards`,{
            floor_ID : floor,
            securityGuard_ID : props.administratorId
        },{
            headers: {
                idtoken: admintoken
            }
        }).then((resp) => {
            axios.get(`${url}Administrators?$filter=securityGuardId eq ${props.administratorId}`,{
                headers: {
                    idtoken: admintoken
                }
            })
                .then(resp => {
                    setSecurityGuardsFloors(resp.data.value)
                })
        })
    }

    var deleteFloor = (floorId) => {
        axios.delete(`${url}FloorSecurityGuards/${floorId}`,{
            headers: {
                idtoken: admintoken
            }
        })
            .then((resp) => {
                axios.get(`${url}Administrators?$filter=securityGuardId eq ${props.administratorId}`,{
                    headers: {
                        idtoken: admintoken
                    }
                })
                    .then(resp => {
                        setSecurityGuardsFloors(resp.data.value)
                    })
            })
    }


    useEffect(() => {
        if (props.administratorId) {
            refFloor.current.addEventListener('change', (event) => {
                setFloor(event.target.options[event.target._selectedIndex].value)
            })
            axios.get(`${url}SecurityGuards?$filter=ID eq ${props.administratorId}`,{
                headers: {
                    idtoken: admintoken
                }
            })
                .then(resp => {
                    setName(resp.data.value[0].name)
                    setEmail(resp.data.value[0].email)
                })
            axios.get(`${url}Floors`,{
                headers: {
                    idtoken: admintoken
                }
            })
                .then(resp => {
                    setFloors(resp.data.value)
                    setFloor(resp.data.value[0].ID)
                })

            axios.get(`${url}Administrators?$filter=securityGuardId eq ${props.administratorId}`,{
                headers: {
                    idtoken: admintoken
                }
            })
                .then(resp => {
                    setSecurityGuardsFloors(resp.data.value)
                })
        }else{
            setName('')
            setEmail('')
        }
    }, [props.administratorId])

    useEffect(() => {

        refName.current.addEventListener('input', (event) => {
            setName(event.target.value)
        })
        refEmail.current.addEventListener('input', (event) => {
            setEmail(event.target.value)
        })
        return () => {            
            refName.current.addEventListener('input', (event) => {
                setName(event.target.value)
            })
            refEmail.current.addEventListener('input', (event) => {
                setEmail(event.target.value)
            })
        }
    })
    
    return (
        <div>
            <Dialog
                ref={props.dialogRef}
                stretch
                header={
                    <Grid defaultSpan="XL12 L12 M12 S12">
                        <div style={{ marginTop: '1.2%', textAlign: 'right' }}>
                            <span style={{ textAlign: 'left', float: 'left', paddingTop: '0.5%' }}>
                                <Title level="H3">{!props.administratorId ? 'Novo Administrador' : name}</Title>
                            </span>
                        </div>
                    </Grid>
                }
                footer={
                    <Grid defaultSpan="XL12 L12 M12 S12">
                        <div style={{ textAlign: 'right', paddingTop:'8px' }}>
                            {props.administratorId ? <Button design="Emphasized" icon="edit" onClick={edit} style={{verticalAlign:'top'}}>Editar</Button> : <Button design="Emphasized" icon="add" onClick={create} style={{verticalAlign:'top'}}>Adicionar</Button>}
                            <Button style={{marginLeft:'8px'}} design="Transparent" onClick={e => { props.dialogRef.current.close() }}>Cancelar</Button>
                        </div>
                    </Grid>
                }
            >
                <Grid>
                    <div>
                        <Label style={{ width: '100%' }} className="Labels" id="lblNome" for="nome" required>Nome: </Label>
                        <Input style={{ width: '100%' }} id="nome" ref={refName} value={name} />
                    </div>
                    <div>
                        <Label style={{ width: '100%' }} className="Labels" id="lblEmail" for="email" required>E-mail: </Label>
                        <Input style={{ width: '100%' }} id="email" ref={refEmail} value={email} />
                    </div>
                </Grid>
                {
                    props.administratorId && (
                        <Grid defaultSpan="XL12 L12 M12 S12">
                            <div>
                                <Title level="H5">Localidades</Title>
                            </div>
                            <div>
                                <Label style={{ width: '100%' }} className="Labels" id="lblFloor" for="floor" required>Adicionar Localidade: </Label>
                                <ui5-select style={{ width: '96%' }} value={floor} ref={refFloor} class="select" id="floor" aria-required="true" aria-labelledby="myLabel3">
                                    {
                                        floors.map((floor) => {
                                            return (
                                                <ui5-option key={floor.ID} value={floor.ID}>{floor.name}</ui5-option>
                                            )
                                        })
                                    }
                                </ui5-select>
                                <ui5-button design="Emphasized" icon="add" style={{ verticalAlign : 'middle', float:"right"}} onClick={addFloor}></ui5-button>
                            </div>
                            <div>
                                <ui5-table class="demo-table" no-data-text="Nenhuma localidade foi encontrada." show-no-data>
                                    <ui5-table-column slot="columns">
                                        <span>Nome</span>
                                    </ui5-table-column>
                                    <ui5-table-column slot="columns" popin-text="Supplier">
                                        <span>Capacidade</span>
                                    </ui5-table-column>
                                    <ui5-table-column slot="columns" popin-text="Supplier">
                                        <span>Ação</span>
                                    </ui5-table-column>
                                    {
                                        securityGuardsFloors.map((floor) => (
                                            <ui5-table-row key={floor.ID}>
                                                <ui5-table-cell style={{ verticalAlign: 'middle' }} popin-text="Weight" demand-popin>
                                                    <span>{floor.floorName}</span>
                                                </ui5-table-cell>
                                                <ui5-table-cell style={{ verticalAlign: 'middle' }} popin-text="Weight" demand-popin>
                                                    <span>{floor.capacity}</span>
                                                </ui5-table-cell>
                                                <ui5-table-cell style={{ verticalAlign: 'middle' }} popin-text="Weight" demand-popin>
                                                    <ui5-button design="Default" icon="delete" onClick={e => deleteFloor(floor.ID)}></ui5-button>
                                                </ui5-table-cell>
                                            </ui5-table-row>
                                        ))
                                    }
                                </ui5-table>
                            </div>
                        </Grid>
                    )
                }
            </Dialog>
            <Toast id="toastAdministratorForm">
                {toastMsg}
            </Toast>
        </div>
    )
}

export default AdministratorsForm