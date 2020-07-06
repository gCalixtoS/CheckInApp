import React, { useEffect } from 'react'
import logo from './assets/SAP_scrn_R.png'

import "@ui5/webcomponents-fiori/dist/ShellBar"
import Tabs from './components/Tabs/Tabs'

import  WithAuth  from './msal/MsalAuthProvider'
import { UserAgentApplication } from 'msal'
import { msalConfig } from './msal/MsalConfig'
import axios from 'axios'
function RootApp() {
    return (
        <div className="App">
            <ui5-shellbar
                primary-title="Office Check-in App"
                logo={logo}
            >
            </ui5-shellbar>
            <Tabs />
        </div>
    )
}


export const App = () => {return WithAuth(RootApp)};
