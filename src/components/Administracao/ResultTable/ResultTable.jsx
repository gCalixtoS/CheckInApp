import React from 'react'

import "@ui5/webcomponents/dist/Table"
import "@ui5/webcomponents/dist/TableColumn"
import "@ui5/webcomponents/dist/TableRow"
import "@ui5/webcomponents/dist/TableCell"

function ResultTable(props) {

    return (
        <div>
            <ui5-table class="demo-table" no-data-text={`Nenhum ${props.placeholder} foi encontrado. Clique em adicionar para criar um novo.`} show-no-data>
                {
                    props.columns !== undefined && (
                        props.columns.map((column, i) => {
                            return (
                                <ui5-table-column slot="columns" key={i}>
                                    <span>{column.placeholder}</span>
                                </ui5-table-column>
                            )
                        })
                    )
                }
                {
                    props.results !== undefined && (
                        props.results.map((result, i) => {
                            return (
                                <ui5-table-row key={i}>
                                    {
                                        props.columns.map((column) => {
                                            // if (column.name === 'active'){
                                            //     return (
                                            //         <span onClick={e => { openDialog(office.ID) }} style={{float: "left"}}>
                                            //             <ui5-button icon="edit" aria-labelledby="lblEdit" style={{ margin: '0 8px 8px 0' }} ></ui5-button>
                                            //         </span>
                                            //     )
                                            // }
                                            return (
                                                <ui5-table-cell popin-text="Weight" demand-popin>
                                                    <span>{result[column.name]}</span>
                                                </ui5-table-cell>
                                            )
                                        })
                                    }
                                </ui5-table-row>
                            )
                        })
                    )
                }
            </ui5-table>
        </div>
    )
}

export default ResultTable