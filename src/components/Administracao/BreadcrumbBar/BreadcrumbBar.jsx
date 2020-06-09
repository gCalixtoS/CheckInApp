import React from 'react'

import { Bar } from '@ui5/webcomponents-react/lib/Bar'
import Breadcrumb from '../Breadcrumb/Breadcrumb'

function BreadcrumbBar(props) {    
    return (
        <div>
            <Bar
                contentLeft={<Breadcrumb links={props.links} currentLocation={props.currentLocation} />}
                style={{height:"15px"}}
            />
        </div>
    )
}

export default BreadcrumbBar
