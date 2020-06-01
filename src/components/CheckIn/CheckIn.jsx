import React from 'react'
import "@ui5/webcomponents/dist/Button"
import "@ui5/webcomponents/dist/Select"
import "@ui5/webcomponents/dist/Option"
import "@ui5/webcomponents/dist/DatePicker"
import "@ui5/webcomponents/dist/Label"
import "@ui5/webcomponents/dist/Title"

import { Grid } from '@ui5/webcomponents-react/lib/Grid';

import "@ui5/webcomponents/dist/Table";
import "@ui5/webcomponents/dist/TableColumn";
import "@ui5/webcomponents/dist/TableRow";
import "@ui5/webcomponents/dist/TableCell";

import './CheckIn.css'

export default _ => {
    return (
        <div>
            <Grid className="CheckIn">
                <div>
                    <ui5-label style={{width: '100%'}} className="Labels" id="lblEscritorio" for="escritorio" required>Escritório: </ui5-label>
                    <ui5-select class="select" id="escritorio" aria-required="true" aria-labelledby="myLabel3">
                        <ui5-option selected>São Paulo</ui5-option>
                        <ui5-option>Rio de Janeiro</ui5-option>
                        <ui5-option>São Leopoldo</ui5-option>
                    </ui5-select>
                </div>
                <div>
                    <ui5-label style={{width: '100%'}} className="Labels" id="lblLocalidade" for="localidade" required>Localidade: </ui5-label>
                    <ui5-select class="select" id="localidade">
                        <ui5-option selected>5º Andar</ui5-option>
                        <ui5-option>6º Andar</ui5-option>
                        <ui5-option>7º Andar</ui5-option>
                    </ui5-select>
                </div>
                <div>
                    <ui5-label style={{width: '100%'}} className="Labels" id="lblData" for="data" required>Data: </ui5-label>
                    <ui5-datepicker id="data" min-date="1/1/2020" max-date="4/5/2020" format-pattern="dd/MM/yyyy"></ui5-datepicker>
                </div>
                <div>
                    <br></br>
                    <ui5-label style={{marginRight: '20px'}} className="Labels">X Lugares Disponíveis</ui5-label>
                    <ui5-button>Check-in</ui5-button>
                </div>
            </Grid>
            <div>
                <div>
                    <ui5-title level="H2">Meus Agendamentos</ui5-title>
                </div>
                <div style={{'overflowX':'auto'}}>
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
                    </ui5-table>
                </div>
            </div>
        </div>
    )
}