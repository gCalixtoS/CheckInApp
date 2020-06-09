import React, { useRef, useState, useEffect } from 'react'
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

function AdministratorsForm(props) {
    const url = process.env.REACT_APP_CHECKINAPI

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
        }).then(resp => {
            setToastMsg('Escritório Atualizado!')
            props.dialogRef.current.close()
            document.getElementById('toastAdministratorForm').show()
            props.doneCallback()
        }).catch((error) => {
            if (error.response.data.error.code === "400") {
                setToastMsg(error.response.data.error.message)
            } else {
                setToastMsg('Erro ao atualizar o escritório, Tente novamente em alguns instantes.')
            }

            document.getElementById('toastAdministratorForm').show()
        })
    }

    var create = () => {
        axios.post(`${url}SecurityGuards`, {
            name: name,
            email: email,
            active: 1
        }).then(resp => {
            setToastMsg('Andar Cadastrado!')
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
            floor_ID : +floor,
            securityGuard_ID : props.administratorId
        }).then((resp) => {
            axios.get(`${url}Administrators?$filter=securityGuardId eq ${props.administratorId}`)
                .then(resp => {
                    setSecurityGuardsFloors(resp.data.value)
                })
        })
    }

    var deleteFloor = (floorId) => {
        axios.delete(`${url}FloorSecurityGuards/${floorId}`)
            .then((resp) => {
                axios.get(`${url}Administrators?$filter=securityGuardId eq ${props.administratorId}`)
                    .then(resp => {
                        setSecurityGuardsFloors(resp.data.value)
                    })
            })
    }


    useEffect(() => {
        if (props.administratorId) {
            axios.get(`${url}SecurityGuards?$filter=ID eq ${props.administratorId}`)
                .then(resp => {
                    setName(resp.data.value[0].name)
                    setEmail(resp.data.value[0].email)
                })
            axios.get(`${url}Floors`)
                .then(resp => {
                    setFloors(resp.data.value)
                    setFloor(resp.data.value[0].ID)
                })

            axios.get(`${url}Administrators?$filter=securityGuardId eq ${props.administratorId}`)
                .then(resp => {
                    setSecurityGuardsFloors(resp.data.value)
                })
        }
    }, [props.administratorId])

    useEffect(() => {
        if (refFloor.current !== undefined){
            refFloor.current.addEventListener('change', (event) => {
                setFloor(event.target.options[event.target._selectedIndex].value)
            })
        }
        
        refName.current.addEventListener('input', (event) => {
            setName(event.target.value)
        })
        refEmail.current.addEventListener('input', (event) => {
            setEmail(event.target.value)
        })

        props.dialogRef.current.addEventListener('afterClose', (event) => {
            setName('')
            setEmail('')
        })
        return () => {
            if(refFloor.current !== undefined){
                refFloor.current.addEventListener('change', (event) => {
                    setFloor(event.target.options[event.target._selectedIndex].value)
                })
            }
            
            refName.current.addEventListener('input', (event) => {
                setName(event.target.value)
            })
            refEmail.current.addEventListener('input', (event) => {
                setEmail(event.target.value)
            })
            props.dialogRef.current.addEventListener('afterClose', (event) => {
                setName('')
                setEmail('')
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
                            <ui5-button style={{ marginRight: '8px' }} design="Negative" icon="cancel" onClick={e => { props.dialogRef.current.close() }}></ui5-button>
                        </div>
                    </Grid>
                }
                footer={
                    <Grid defaultSpan="XL12 L12 M12 S12">
                        <div style={{ marginTop: '1.2%', textAlign: 'right' }}>
                            {props.administratorId ? <ui5-button design="Positive" icon="edit" onClick={edit}>Editar</ui5-button> : <ui5-button design="Positive" icon="add" onClick={create}>Adicionar</ui5-button>}
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
                                <Title level="H5">Andares</Title>
                            </div>
                            <div>
                                <Label style={{ width: '100%' }} className="Labels" id="lblFloor" for="floor" required>Adicionar Andar: </Label>
                                <ui5-select style={{ width: '96%' }} value={floor} ref={refFloor} class="select" id="floor" aria-required="true" aria-labelledby="myLabel3">
                                    {
                                        floors.map((floor) => {
                                            return (
                                                <ui5-option key={floor.ID} value={floor.ID}>{floor.name}</ui5-option>
                                            )
                                        })
                                    }
                                </ui5-select>
                                <ui5-button design="Positive" icon="add" style={{ verticalAlign : 'middle', float:"right"}} onClick={addFloor}></ui5-button>
                            </div>
                            <div>
                                <ui5-table class="demo-table" no-data-text="Nenhum Andar foi encontrado." show-no-data>
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
                                                    <ui5-button design="Negative" icon="delete" onClick={e => deleteFloor(floor.ID)}></ui5-button>
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