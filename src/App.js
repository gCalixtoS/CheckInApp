import React from 'react'
import logo from './assets/SAP_scrn_R.png'
import "@ui5/webcomponents-fiori/dist/ShellBar"
import Tabs from './components/Tabs/Tabs'
import axios from 'axios'

const url = 'https://sap-presales-cloud--neo-foundry--sappsbr-dev-graph-tutorial-srv.cfapps.eu10.hana.ondemand.com'
const headers = {
    'user': 'sb-clone1e2b1f2b89674b55afa155fbddc97144!b14870|destination-xsappname!b404',
    'password': 'dN3Cfc9sb+wtXyXg2CtM913jGtw=',
}
var login = () => {
    axios.get(url, {headers})
        .then(resp => console.log(resp))
}

function App() {
    login()
    return (
        <div className="App">
            <ui5-shellbar
                primary-title="Office Check-in App"
                logo={logo}
            >
            </ui5-shellbar>
            <Tabs />
        </div>
    );
}

export default App;
