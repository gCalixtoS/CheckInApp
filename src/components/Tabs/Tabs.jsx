import React from 'react'

import "@ui5/webcomponents/dist/TabContainer"
import "@ui5/webcomponents/dist/Tab"
import "@ui5/webcomponents/dist/TabSeparator"

import CheckIn from '../CheckIn/CheckIn'
import Report from '../Report/Report'


export default _ => {
    return (
        <ui5-tabcontainer class="full-width" show-overflow>
            <ui5-tab text="Check-in" selected>
                <CheckIn />
            </ui5-tab>
            <ui5-tab text="Report">
                <Report />
            </ui5-tab>
        </ui5-tabcontainer>
    )
}