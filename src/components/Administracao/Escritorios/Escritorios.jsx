import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'

import "@ui5/webcomponents/dist/Table"
import "@ui5/webcomponents/dist/TableColumn"
import "@ui5/webcomponents/dist/TableRow"
import "@ui5/webcomponents/dist/TableCell"
import "@ui5/webcomponents-icons/dist/icons/add"

import { Input } from '@ui5/webcomponents-react/lib/Input'
import { Grid } from '@ui5/webcomponents-react/lib/Grid'
import { Switch } from '@ui5/webcomponents-react/lib/Switch'
import { Toast } from '@ui5/webcomponents-react/lib/Toast'

import "@ui5/webcomponents-icons/dist/icons/stop"
import "@ui5/webcomponents-icons/dist/icons/restart"

import BreadcrumbBar from '../BreadcrumbBar/BreadcrumbBar'
import EscritoriosForms from './EscritoriosForm'


function Escritorios() {
    const url = process.env.REACT_APP_CHECKINAPI

    const refForm = useRef()

    const [offices, setOffices] = useState([])
    const [officeId, setOfficeId] = useState(false)
    const [toastMsg, setToastMsg] = useState()

    var putStatus = (checked, floorId) => {
        axios.put(`${url}Offices/${floorId}`, {
            active: checked ? 1 : 0
        }).then(resp => {
            setToastMsg(checked ? 'Escritório Ativado!' : 'Escritório Desativado!')
            document.getElementById('toastEscritorio').show()
        }).catch((error) => {
            if (error.response.data.error.code === "400") {
                setToastMsg(error.response.data.error.message)
            } else {
                setToastMsg('Erro ao atualizar o Escritório, Tente novamente em alguns instantes.')
            }

            document.getElementById('toastEscritorio').show()
        })
    }

    var getOffices = () => {
        axios.get(`${url}Offices?$orderby=ID desc`)
            .then((resp) => {
                setOffices(resp.data.value)
            })
    }

    var openDialog = (attrId) => {
        setOfficeId(attrId)
        refForm.current.open()
    }

    var filter = (search) => {
        if (search !== '') {
            axios.get(`${url}Offices?$filter=contains(name,'${search}')`)
                .then((resp) => {
                    setOffices(resp.data.value)
                })
        } else {
            getOffices()
        }

    }

    useEffect(() => {
        getOffices()
    }, [])

    return (
        <div>
            <Grid defaultSpan="XL12 L12 M12 S12">
                <div>
                    <BreadcrumbBar links={[{ text: 'Administração', href: `${process.env.REACT_APP_ROOT}Administracao` }]} currentLocation="Escritórios" />
                </div>
                <div>
                    <Input onInput={(e) => { filter(e.target.value) }} placeholder="Digite o nome do escritório." style={{ width: '100%' }}>
                        <ui5-icon id="searchIcon" slot="icon" name="search"></ui5-icon>
                    </Input>
                </div>
                <div style={{ textAlign: "right" }}>
                    <ui5-button design="Positive" icon="add" onClick={e => { openDialog(false) }}>Novo</ui5-button>
                </div>
                <div>
                    <ui5-table class="demo-table" no-data-text="Nenhum escritório foi encontrado. Clique em adicionar para criar um novo." show-no-data>
                        <ui5-table-column slot="columns">
                            <span>Escritório</span>
                        </ui5-table-column>

                        <ui5-table-column slot="columns" popin-text="Supplier">
                            <span>Endereço</span>
                        </ui5-table-column>

                        <ui5-table-column slot="columns" popin-text="Dimensions" demand-popin>
                            <span>Código</span>
                        </ui5-table-column>

                        <ui5-table-column slot="columns" popin-text="Weight" demand-popin>
                            <span>Ação</span>
                        </ui5-table-column>
                        {
                            offices.map((office) => {
                                return (
                                    <ui5-table-row key={office.ID}>
                                        <ui5-table-cell popin-text="Weight" demand-popin>
                                            <span>{office.name}</span>
                                        </ui5-table-cell>
                                        <ui5-table-cell popin-text="Weight" demand-popin>
                                            <span>{office.localization}</span>
                                        </ui5-table-cell>
                                        <ui5-table-cell popin-text="Weight" demand-popin>
                                            <span>{office.code}</span>
                                        </ui5-table-cell>
                                        <ui5-table-cell popin-text="Weight" demand-popin>
                                            <span onClick={e => { openDialog(office.ID) }} style={{float: "left"}}>
                                                <ui5-button icon="edit" aria-labelledby="lblEdit" style={{ margin: '0 8px 8px 0' }} ></ui5-button>
                                            </span>
                                            <span>
                                                <Switch checked={office.active === 1} graphical onChange={e => putStatus(e.target.checked, office.ID)}></Switch>
                                            </span>
                                        </ui5-table-cell>
                                    </ui5-table-row>
                                )
                            })
                        }
                    </ui5-table>
                </div>
            </Grid>
            <EscritoriosForms officeId={officeId} doneCallback={getOffices} dialogRef={refForm} />
            <Toast id="toastEscritorio">
                {toastMsg}
            </Toast>
        </div>
    )
}

export default Escritorios