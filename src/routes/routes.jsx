import React from 'react'
import { BrowserRouter, Route,  Redirect, Switch } from 'react-router-dom';

import CheckIn from '../components/CheckIn/CheckIn'
import Report from '../components/Report/Report'
import Administracao from '../components/Administracao/Administracao'
import Escritorios from '../components/Administracao/Escritorios/Escritorios'
import Floors from '../components/Administracao/Floors/Floors'
import Administrators from '../components/Administracao/Administrators/Administrators'


export default props => {
    return (

        <BrowserRouter>
            <Switch>
                <Route path='/CheckIn' component={CheckIn}></Route>
                <Route path='/Report' component={Report}></Route>
                <Route exact path='/Administracao' component={Administracao}></Route>
                <Route path='/Administracao/Escritorios' component={Escritorios}></Route>
                <Route path='/Administracao/Andares' component={Floors}></Route>
                <Route path='/Administracao/Administradores' component={Administrators}></Route>
                <Redirect exact from='*' to='/CheckIn' />
            </Switch>
            
        </BrowserRouter>
    )
}