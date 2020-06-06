import React from 'react'
import {Router, Route, Redirect, hashHistory } from 'react-router'

import CheckIn from '../CheckIn/CheckIn'
import Report from '../Report/Report'
import Administracao from '../Administracao/Administracao'


export default props => {
    <Router history={hashHistory}>
        <Route path='/CheckIn' component={CheckIn}></Route>
        <Route path='/Report' component={Report}></Route>
        <Route path='/Administracao' component={Administracao}></Route>
        <Redirect from="*" to="/CheckIn"></Redirect>
    </Router>
}