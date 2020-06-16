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
import { Button } from '@ui5/webcomponents-react/lib/Button'

function FloorsForm(props) {
    const url = process.env.REACT_APP_CHECKINAPI

    const refCapacity = useRef()
    const refName = useRef()
    const refOffice = useRef()
    const refAdministrator = useRef()

    const [name, setName] = useState()
    const [capacity, setCapacity] = useState()
    const [office, setOffice] = useState()

    const [offices, setOffices] = useState([])
    const [administrators, setAdministrators] = useState([])
    const [administrator, setAdministrator] = useState()
    const [securityGuards, setSecurityGuards] = useState([])

    const [toastMsg, setToastMsg] = useState()

    var create = () => {
        axios.post(`${url}Floors`, {
            name: name,
            capacity: +capacity,
            office_ID: +office,
            active: 1
        }).then(resp => {
            setToastMsg('Andar Cadastrado!')
            props.dialogRef.current.close()
            document.getElementById('toastFloorsForm').show()
            props.doneCallback()
        }).catch((error) => {
            if (error.response.data.error.code === "400") {
                setToastMsg(error.response.data.error.message)
            } else {
                setToastMsg('Erro ao inserir o escritório, Tente novamente em alguns instantes.')
            }

            document.getElementById('toastFloorsForm').show()
        })
    }

    var edit = () => {
        axios.put(`${url}Floors/${props.floorId}`, {
            name: name,
            capacity: capacity,
            office_ID: +office,
        }).then(resp => {
            setToastMsg('Escritório Atualizado!')
            props.dialogRef.current.close()
            document.getElementById('toastFloorsForm').show()
            props.doneCallback()
        }).catch((error) => {
            if (error.response.data.error.code === "400") {
                setToastMsg(error.response.data.error.message)
            } else {
                setToastMsg('Erro ao atualizar o escritório, Tente novamente em alguns instantes.')
            }

            document.getElementById('toastFloorsForm').show()
        })
    }

    var putStatus = (checked, floorId) => {
        axios.put(`${url}Administrators/${floorId}`, {
            active: checked ? 1 : 0
        }).then(resp => {
            setToastMsg(checked ? 'Andar Ativado!' : 'Andar Desativado!')
            document.getElementById('toastFloorsForm').show()
        }).catch((error) => {
            if (error.response.data.error.code === "400") {
                setToastMsg(error.response.data.error.message)
            } else {
                setToastMsg('Erro ao atualizar o andar, Tente novamente em alguns instantes.')
            }

            document.getElementById('toastFloorsForm').show()
        })
    }

    var addAdministrator = () => {
        axios.post(`${url}FloorSecurityGuards`, {
            floor_ID: +props.floorId,
            securityGuard_ID: administrator
        }).then((resp) => {
            axios.get(`${url}Administrators?$filter=floorId eq ${props.floorId}`)
                .then(resp => {
                    setAdministrators(resp.data.value)
                })
        })
    }

    var deleteAdministrator = (adminId) => {
        axios.delete(`${url}FloorSecurityGuards/${adminId}`)
            .then((resp) => {
                axios.get(`${url}Administrators?$filter=floorId eq ${props.floorId}`)
                    .then(resp => {
                        setAdministrators(resp.data.value)
                    })
            })
    }

    /*---------------------------------------------------------------------------------------*/
    useEffect(() => {
        if (props.floorId) {
            refAdministrator.current.addEventListener('change', (event) => {
                setName(event.target.options[event.target._selectedIndex].value)
            })
            axios.get(`${url}Floors?$filter=ID eq ${props.floorId}`)
                .then(resp => {
                    setName(resp.data.value[0].name)
                    setCapacity(resp.data.value[0].capacity)
                    setOffice(resp.data.value[0].office_ID)
                })
            axios.get(`${url}SecurityGuards`)
                .then(resp => {
                    setSecurityGuards(resp.data.value)
                    setAdministrator(resp.data.value[0].ID)
                })

            axios.get(`${url}Administrators?$filter=floorId eq ${props.floorId}`)
                .then(resp => {
                    setAdministrators(resp.data.value)
                })
        }else{
            setName('')
            setCapacity('')
            setOffice('')
        }
        axios.get(`${url}Offices`)
            .then(resp => {
                setOffices(resp.data.value)
                if (!props.floorId)
                    setOffice(resp.data.value[0].ID)
            })
    }, [props.floorId])

    useEffect(() => {
        refName.current.addEventListener('input', (event) => {
            setName(event.target.value)
        })
        refCapacity.current.addEventListener('input', (event) => {
            setCapacity(event.target.value)
        })
        refOffice.current.addEventListener('change', (event) => {
            setOffice(event.target.options[event.target._selectedIndex].value)
        })
        return () => {
            refName.current.addEventListener('input', (event) => {
                setName(event.target.value)
            })
            refCapacity.current.addEventListener('input', (event) => {
                setCapacity(event.target.value)
            })
            refOffice.current.addEventListener('change', (event) => {
                setOffice(event.target.options[event.target._selectedIndex].value)
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
                                <Title level="H3">{!props.floorId ? 'Novo Andar' : name}</Title>
                            </span>
                        </div>
                    </Grid>
                }
                footer={
                    <Grid defaultSpan="XL12 L12 M12 S12">
                        <div style={{ textAlign: 'right', paddingTop:'8px' }}>
                            {props.floorId ? <Button design="Emphasized" icon="edit" onClick={edit} style={{verticalAlign:'top'}}>Editar</Button> : <Button design="Emphasized" icon="add" onClick={create} style={{verticalAlign:'top'}}>Adicionar</Button>}
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
                        <Label style={{ width: '100%' }} className="Labels" id="lblCapacidade" for="capacidade" required>Capacidade: </Label>
                        <Input style={{ width: '100%' }} type="Number" id="capacidade" ref={refCapacity} value={capacity} />
                    </div>
                    <div>
                        <Label style={{ width: '100%' }} className="Labels" id="lblEscritorio" for="escritorio" required>Escritório: </Label>
                        <ui5-select style={{ width: '100%' }} value={office} ref={refOffice} class="select" id="escritorio" aria-required="true" aria-labelledby="myLabel3">
                            {
                                offices.map((optOffice) => {
                                    if (optOffice.ID === office) {
                                        return (
                                            <ui5-option key={optOffice.ID} value={optOffice.ID} selected>{optOffice.name}</ui5-option>
                                        )
                                    }
                                    return (
                                        <ui5-option key={optOffice.ID} value={optOffice.ID}>{optOffice.name}</ui5-option>
                                    )
                                })
                            }
                        </ui5-select>
                    </div>
                </Grid>
                {
                    props.floorId && (
                        <Grid defaultSpan="XL12 L12 M12 S12">
                            <div>
                                <Title level="H5">Administradores</Title>
                            </div>
                            <div>
                                <Label style={{ width: '100%' }} className="Labels" id="lblAdministrador" for="administrador" required>Adicionar Administrador: </Label>
                                <ui5-select style={{ width: '96%' }} value={administrator} ref={refAdministrator} class="select" id="administrador" aria-required="true" aria-labelledby="myLabel3">
                                    {
                                        securityGuards.map((administrator) => {
                                            return (
                                                <ui5-option key={administrator.ID} value={administrator.ID}>{administrator.name}</ui5-option>
                                            )
                                        })
                                    }
                                </ui5-select>
                                <ui5-button design="Emphasized" icon="add" style={{ verticalAlign: 'middle', float: "right" }} onClick={addAdministrator}></ui5-button>
                            </div>
                            <div>
                                <ui5-table class="demo-table" no-data-text="Nenhum Administrador foi encontrado." show-no-data>
                                    <ui5-table-column slot="columns">
                                        <span>Nome</span>
                                    </ui5-table-column>
                                    <ui5-table-column slot="columns" popin-text="Supplier">
                                        <span>E-mail</span>
                                    </ui5-table-column>
                                    <ui5-table-column slot="columns" popin-text="Supplier">
                                        <span>Ação</span>
                                    </ui5-table-column>
                                    {
                                        administrators.map((administrator) => (
                                            <ui5-table-row key={administrator.ID}>
                                                <ui5-table-cell style={{ verticalAlign: 'middle' }} popin-text="Weight" demand-popin>
                                                    <span>{administrator.securityGuardName}</span>
                                                </ui5-table-cell>
                                                <ui5-table-cell style={{ verticalAlign: 'middle' }} popin-text="Weight" demand-popin>
                                                    <span>{administrator.securityGuardEmail}</span>
                                                </ui5-table-cell>
                                                <ui5-table-cell style={{ verticalAlign: 'middle' }} popin-text="Weight" demand-popin>
                                                    <ui5-button design="Default" icon="delete" onClick={e => deleteAdministrator(administrator.ID)}></ui5-button>
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
            <Toast id="toastFloorsForm">
                {toastMsg}
            </Toast>
        </div>
    )
}

export default FloorsForm