import React, { useEffect, useRef } from 'react'

import "@ui5/webcomponents/dist/TabContainer"
import "@ui5/webcomponents/dist/Tab"
import "@ui5/webcomponents/dist/TabSeparator"

import Routes from '../../routes/routes'

function Tabs () {

    const refTab = useRef()

    var selectTab = (tabIndex) => {
        const tabs = {
            0 : `/CheckIn`,
            1 : `/Report`,
            2 : `/Administracao`
        }

        window.location.href = tabs[tabIndex];
    }

    useEffect(() => {
        refTab.current.addEventListener('tabSelect', (event) => {
            selectTab(event.detail.tabIndex)
        })
        return () =>{
            refTab.current.removeEventListener('change', (event) => {
                selectTab(event.detail.tabIndex)
            })
        }
        
    }, [])
    return (
        <div>
            <ui5-tabcontainer ref={refTab} class="full-width">
                {
                    window.location.href === `${process.env.REACT_APP_ROOT}CheckIn` ? <ui5-tab text="Check-in" selected><Routes /></ui5-tab> : <ui5-tab text="Check-in"><Routes /></ui5-tab>
                }
                {   
                    window.location.href === `${process.env.REACT_APP_ROOT}Report` ? <ui5-tab text="Report" selected><Routes /></ui5-tab> : <ui5-tab text="Report"><Routes /></ui5-tab>
                }   
                {
                    window.location.href.startsWith(`${process.env.REACT_APP_ROOT}Administracao`) ? <ui5-tab text="Administração" selected><Routes /></ui5-tab> : <ui5-tab text="Administração"><Routes /></ui5-tab>
                }
            </ui5-tabcontainer>

        </div>
    )
}

export default Tabs