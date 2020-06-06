import React from 'react'
import { Grid } from '@ui5/webcomponents-react/lib/Grid'

import Escritorios from './Escritorios/Escritorios'

function Administracao() {
    return (
        <div>
            <Grid defaultSpan="XL12 L12 M12 S12">
                <Escritorios />
            </Grid>
        </div>
    )
}

export default Administracao
