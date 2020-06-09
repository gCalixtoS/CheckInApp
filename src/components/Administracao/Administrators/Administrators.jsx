import React, { useState, useRef } from 'react'
import axios from 'axios'

import { Grid } from '@ui5/webcomponents-react/lib/Grid'
import { Switch } from '@ui5/webcomponents-react/lib/Switch'
import "@ui5/webcomponents/dist/Toast"

import SearchBar from '../SearchBar/SearchBar'
import BreadcrumbBar from '../BreadcrumbBar/BreadcrumbBar'
// import RestultTable from '../ResultTable/ResultTable'
import EditButton from '../EditButton/EditButton'
import CreateButton from '../CreateButton/CreateButton'
import AdministratorForm from './AdministratorForm'

import "@ui5/webcomponents/dist/Table"
import "@ui5/webcomponents/dist/TableColumn"
import "@ui5/webcomponents/dist/TableRow"
import "@ui5/webcomponents/dist/TableCell"

function Floors() {
    const url = process.env.REACT_APP_CHECKINAPI

    const [administrators, setAdministrators] = useState([])
    const [administratorId, setAdministratorId] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [toastMsg, setToastMsg] = useState('')

    const refFormDialog = useRef()

    var putStatus = (checked, floorId) => {
        axios.put(`${url}Floors/${floorId}`, {
            active : checked ? 1 : 0
        }).then(resp => {
            setToastMsg( checked ?'Andar Ativado!' :'Andar Desativado!')
            document.getElementById('toastFloors').show()
        }).catch((error) => {
            if (error.response.data.error.code === "400") {
                setToastMsg(error.response.data.error.message)
            } else {
                setToastMsg('Erro ao atualizar o andar, Tente novamente em alguns instantes.')
            }

            document.getElementById('toastFloors').show()
        })
    }

    return (
        <div>
            <Grid defaultSpan="XL12 L12 M12 S12">
                <div>
                    <BreadcrumbBar links={[{ text: 'Administração', href: `${process.env.REACT_APP_ROOT}Administracao` }]} currentLocation="Administradores" />
                </div>
                <div>
                    <SearchBar searchObject="SecurityGuards" searchField="name" searchPlaceholder="administrador" setResult={(data) => setAdministrators(data)} refresh={refresh}/>
                </div>
                <div style={{ textAlign: "right" }}>
                    <CreateButton refDialog={refFormDialog} setState={ (id) => setAdministratorId(id)}/>
                </div>
                <div>
                    <ui5-table class="demo-table" no-data-text="Nenhum administrador foi encontrado. Clique em adicionar para criar um novo." show-no-data>
                        <ui5-table-column slot="columns">
                            <span>Nome</span>
                        </ui5-table-column>

                        <ui5-table-column slot="columns" popin-text="Supplier">
                            <span>E-mail</span>
                        </ui5-table-column>

                        <ui5-table-column slot="columns" popin-text="Weight" demand-popin>
                            <span>Ação</span>
                        </ui5-table-column>
                        {
                            administrators.map((administrator) => {
                                return (
                                    <ui5-table-row key={administrator.ID}>
                                        <ui5-table-cell popin-text="Weight" demand-popin>
                                            <span>{administrator.name}</span>
                                        </ui5-table-cell>
                                        <ui5-table-cell popin-text="Weight" demand-popin>
                                            <span>{administrator.email}</span>
                                        </ui5-table-cell>
                                        <ui5-table-cell popin-text="Weight" demand-popin>
                                            <span style={{float: "left"}}>
                                                <EditButton editId={administrator.ID} refDialog={refFormDialog} setState={ (id) => setAdministratorId(id)}/>
                                            </span>
                                            {/* <span>
                                                <Switch checked={floor.active === 1} graphical onChange={e => putStatus(e.target.checked, floor.ID)}></Switch>
                                            </span> */}
                                        </ui5-table-cell>
                                    </ui5-table-row>
                                )
                            })
                        }
                    </ui5-table>
                </div>
                <div>
                    <AdministratorForm administratorId={administratorId}  dialogRef={refFormDialog} doneCallback={() => setRefresh(!refresh) }/>
                </div>
            </Grid>
            <ui5-toast id="toastFloors">{toastMsg}</ui5-toast>
        </div>
    )
}

export default Floors