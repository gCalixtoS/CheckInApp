import React from 'react'

import { ProductSwitch } from '@ui5/webcomponents-react/lib/ProductSwitch'
import { ProductSwitchItem } from '@ui5/webcomponents-react/lib/ProductSwitchItem'

import "@ui5/webcomponents-icons/dist/icons/building"
import "@ui5/webcomponents-icons/dist/icons/map"
import "@ui5/webcomponents-icons/dist/icons/shield"

function Administracao() {    
    return (
        <div>
            <ProductSwitch style={{width:'100%'}} >
                <ProductSwitchItem heading="Escritórios" subtitle="Gerenciamento dos Escritórios" icon="building" targetSrc={`/Administracao/Escritorios`}/>
                <ProductSwitchItem heading="Localidades" subtitle="Gerenciamento das Localidades" icon="map" targetSrc={`/Administracao/Localidades`}/>
                <ProductSwitchItem heading="Administradores" subtitle="Gerenciamento dos Administradores" icon="shield" targetSrc={`/Administracao/Administradores`}/>
            </ProductSwitch>
        </div>
    )
}

export default Administracao
