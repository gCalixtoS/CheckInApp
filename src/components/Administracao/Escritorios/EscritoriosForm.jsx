import React, { useRef, useState, useEffect } from 'react'
import axios from 'axios'

import "@ui5/webcomponents/dist/Table"
import "@ui5/webcomponents/dist/TableColumn"
import "@ui5/webcomponents/dist/TableRow"
import "@ui5/webcomponents/dist/TableCell"
import "@ui5/webcomponents-icons/dist/icons/add"

import { Dialog } from '@ui5/webcomponents-react/lib/Dialog'
import { Grid } from '@ui5/webcomponents-react/lib/Grid'
import { Title } from '@ui5/webcomponents-react/lib/Title'
import { Label } from '@ui5/webcomponents-react/lib/Label'
import { Input } from '@ui5/webcomponents-react/lib/Input'
import { Toast } from '@ui5/webcomponents-react/lib/Toast'
import { Switch } from '@ui5/webcomponents-react/lib/Switch'
import { Button } from '@ui5/webcomponents-react/lib/Button'

function EscritoriosForm(props) {
    const url = process.env.REACT_APP_CHECKINAPI

    const refName = useRef()
    const refCode = useRef()
    const refLocalization = useRef()

    const [name, setName] = useState()
    const [code, setCode] = useState()
    const [localization, setLocalization] = useState()
    const [floors, setFloors] = useState([])

    const [toastMsg, setToastMsg] = useState()

    var create = () => {
        axios.post(`${url}Offices`, {
            name: name,
            localization: localization,
            code: code,
            active: 1
        }).then(resp => {
            setToastMsg('Escritório Cadastrado!')
            props.dialogRef.current.close()
            document.getElementById('toastEscritorioForm').show()
            props.doneCallback()
        }).catch((error) => {
            if (error.response.data.error.code === "400") {
                setToastMsg(error.response.data.error.message)
            } else {
                setToastMsg('Erro ao inserir o escritório, Tente novamente em alguns instantes.')
            }

            document.getElementById('toastEscritorioForm').show()
        })
    }

    var edit = () => {
        axios.put(`${url}Offices/${props.officeId}`, {
            name: name,
            localization: localization,
            code: code
        }).then(resp => {
            setToastMsg('Escritório Atualizado!')
            props.dialogRef.current.close()
            document.getElementById('toastEscritorioForm').show()
            props.doneCallback()
        }).catch((error) => {
            if (error.response.data.error.code === "400") {
                setToastMsg(error.response.data.error.message)
            } else {
                setToastMsg('Erro ao atualizar o escritório, Tente novamente em alguns instantes.')
            }

            document.getElementById('toastEscritorioForm').show()
        })
    }

    var putStatus = (checked, floorId) => {
        axios.put(`${url}Floors/${floorId}`, {
            active : checked ? 1 : 0
        }).then(resp => {
            setToastMsg( checked ?'Andar Ativado!' :'Andar Desativado!')
            document.getElementById('toastEscritorioForm').show()
        }).catch((error) => {
            if (error.response.data.error.code === "400") {
                setToastMsg(error.response.data.error.message)
            } else {
                setToastMsg('Erro ao atualizar o andar, Tente novamente em alguns instantes.')
            }

            document.getElementById('toastEscritorioForm').show()
        })
    }

    useEffect(() => {
        if (props.officeId) {
            axios.get(`${url}Offices?$filter=ID eq ${props.officeId}`)
                .then(resp => {
                    setName(resp.data.value[0].name)
                    setCode(resp.data.value[0].code)
                    setLocalization(resp.data.value[0].localization)
                })
            
            axios.get(`${url}Floors?$filter=office_ID eq ${props.officeId}`)
                .then(resp => {
                    setFloors(resp.data.value)
                })
        }else{
            setName('')
            setCode('')
            setLocalization('')
        }
    }, [props.officeId])

    useEffect(() => {
        refName.current.addEventListener('input', (event) => {
            setName(event.target.value)
        })
        refCode.current.addEventListener('input', (event) => {
            setCode(event.target.value)
        })
        refLocalization.current.addEventListener('input', (event) => {
            setLocalization(event.target.value)
        })
        return () => {
            refName.current.removeEventListener('input', (event) => {
                setName(event.target.value)
            })
            refCode.current.removeEventListener('input', (event) => {
                setCode(event.target.value)
            })
            refLocalization.current.removeEventListener('input', (event) => {
                setLocalization(event.target.value)
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
                                <Title level="H3">{!props.officeId ? 'Novo Escritório' : name}</Title>
                            </span>
                        </div>
                    </Grid>
                }
                footer={
                    <Grid defaultSpan="XL12 L12 M12 S12">
                        <div style={{ textAlign: 'right', paddingTop:'8px' }}>
                            {props.officeId ? <Button design="Emphasized" icon="edit" onClick={edit} style={{verticalAlign:'top'}}>Editar</Button> : <Button design="Emphasized" icon="add" onClick={create} style={{verticalAlign:'top'}}>Adicionar</Button>}
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
                        <Label style={{ width: '100%' }} className="Labels" id="lblEndereco" for="endereco" required>Endereço: </Label>
                        <Input style={{ width: '100%' }} id="endereco" ref={refLocalization} value={localization} />
                    </div>
                    <div>
                        <Label style={{ width: '100%' }} className="Labels" id="lblCodigo" for="nome" required>Código: </Label>
                        <Input style={{ width: '100%' }} id="codigo" ref={refCode} value={code} />
                    </div>
                </Grid>
                {
                    props.officeId && (
                        <Grid defaultSpan="XL12 L12 M12 S12">
                            <div>
                                <Title level="H5">Andares</Title>
                            </div>
                            <div>
                                <ui5-table class="demo-table" no-data-text="Nenhum escritório foi encontrado. Clique em adicionar para criar um novo." show-no-data>
                                    <ui5-table-column slot="columns">
                                        <span>Andar</span>
                                    </ui5-table-column>
                                    <ui5-table-column slot="columns" popin-text="Supplier">
                                        <span>Capacidade</span>
                                    </ui5-table-column>
                                    <ui5-table-column slot="columns" popin-text="Weight" demand-popin>
                                        <span>Ativo</span>
                                    </ui5-table-column>
                                    {
                                        floors.map((floor) => (
                                            <ui5-table-row key={floor.ID}>
                                                <ui5-table-cell  style={{verticalAlign:'middle'}} popin-text="Weight" demand-popin>
                                                    <span>{floor.name}</span>
                                                </ui5-table-cell>
                                                <ui5-table-cell  style={{verticalAlign:'middle'}} popin-text="Weight" demand-popin>
                                                    <span>{floor.capacity}</span>
                                                </ui5-table-cell>
                                                <ui5-table-cell  style={{verticalAlign:'middle'}} popin-text="Weight" demand-popin>
                                                    <span>
                                                        <Switch checked={floor.active === 1} graphical onChange={e => putStatus(e.target.checked, floor.ID)}></Switch>
                                                    </span>
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
            <Toast id="toastEscritorioForm">
                {toastMsg}
            </Toast>
        </div>
    )
}

export default EscritoriosForm