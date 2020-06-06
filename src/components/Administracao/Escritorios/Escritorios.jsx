import React, { useState, useRef, useEffect } from 'react'
import "@ui5/webcomponents/dist/Panel"
import "@ui5/webcomponents/dist/Title"
import "@ui5/webcomponents/dist/Button"

import { Grid } from '@ui5/webcomponents-react/lib/Grid'

import axios from 'axios'

function Escritorios() {
    const url = process.env.REACT_APP_CHECKINAPI

    const [offices, setOffices ] = useState([])

    useEffect(() => {
        axios.get(`${url}Offices`)
            .then((resp) => {
                setOffices(resp.data.value)
            })
    }, [])

    return (
        <div>
            <ui5-title level="H4">Escritórios</ui5-title>
            {
                offices.map((office) => {
                    return (
                        <ui5-panel key={office.ID} width="100%" accessible-role="Complementary"	header-text={office.name} class="full-width" collapsed>
                            <Grid>
                                <div>
                                    <ui5-label style={{ width: '100%' }} className="Labels" id="lblEscritorioNome" for="escritorioNome" required>Escritório: </ui5-label>
                                    <ui5-input style={{ width: '100%' }} value={office.name} placeholder="Nome do Escritório" id="escritorioNome"></ui5-input>
                                </div>
                                <div>
                                    <ui5-label style={{ width: '100%' }} className="Labels" id="lblEscritorioEndereco" for="escritorioEndereco" required>Endereço: </ui5-label>
                                    <ui5-input style={{ width: '100%' }} value={office.localization} placeholder="Endereço do Escritório" id="escritorioEndereco"></ui5-input>
                                </div>
                                <div>
                                    <ui5-label style={{ width: '100%' }} className="Labels" id="lblCodigoEndereco" for="codigoEndereco" required>Código: </ui5-label>
                                    <ui5-input style={{ width: '100%' }} value={office.code} placeholder="Código do Escritório" id="codigoEndereco"></ui5-input>
                                </div>
                                <div style={{textAlign : 'right'}}>
                                    <br></br>
                                    <ui5-button icon="accept" design="Positive" aria-labelledby="lblAccept" style={{margin: '0 8px 8px 0'}}></ui5-button>
                                    <ui5-button icon="cancel" design="Negative" aria-labelledby="lblCancel" style={{margin: '0 8px 8px 0'}}></ui5-button>
                                </div>
                            </Grid>
                        </ui5-panel>
                    )
                })
            }
        </div>
    )
}

export default Escritorios