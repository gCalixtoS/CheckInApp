import React from 'react'

import { Breadcrumbs } from '@ui5/webcomponents-react/lib/Breadcrumbs'
import { Link } from '@ui5/webcomponents-react/lib/Link'

function Breadcrumb(props) {    
    return (
        <div>
            <Breadcrumbs
                separatorStyle="Slash"
                currentLocationText={props.currentLocation}
            >
                {
                    props.links.map((link, i) => {
                        return (
                            <Link href={link.href}>{link.text}</Link>
                        )
                    })
                }
            </Breadcrumbs>
        </div>
    )
}

export default Breadcrumb
