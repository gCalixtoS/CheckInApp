import React from 'react'
import logo from './assets/SAP_scrn_R.png'

import "@ui5/webcomponents-fiori/dist/ShellBar"
import Tabs from './components/Tabs/Tabs'


import { withAuth } from './msal/MsalAuthProvider'

class RootApp extends React.Component {
    
    render() {
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
}

export const App = withAuth(RootApp);
