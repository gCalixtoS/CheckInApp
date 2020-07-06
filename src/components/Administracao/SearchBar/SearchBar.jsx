import React, {useEffect} from 'react'
import { useSelector, shallowEqual } from "react-redux"

import { Input } from '@ui5/webcomponents-react/lib/Input'
import axios from 'axios'

function SearchBar(props) {

    const url = process.env.REACT_APP_CHECKINAPI_ADM

    const { admintoken } = useSelector(state => ({
        admintoken: state.authToken.admintoken
    }), shallowEqual)

    var filter = (search) => {
        console.log(admintoken)
        if (search !== '') {
            axios.get(`${url}${props.searchObject}?$filter=contains(${props.searchField},'${search}')`,{
                headers: {
                    idtoken: admintoken
                }
            })
                .then((resp) => {
                    props.setResult(resp.data.value)
                })
        } else {
            axios.get(`${url}${props.searchObject}`, {
                headers: {
                    idtoken: admintoken
                }
            })
                .then((resp) => {
                    props.setResult(resp.data.value)
                })
        }

    }

    useEffect(() => {
        if (admintoken){
            axios.get(`${url}${props.searchObject}`, {
                headers: {
                    idtoken: admintoken
                }
            })
                .then((resp) => {
                    props.setResult(resp.data.value)
                })
        }
        
    }, [props.refresh, admintoken])

    useEffect(() => {
        if (admintoken){
            axios.get(`${url}${props.searchObject}`, {
                headers: {
                    idtoken: admintoken
                }
            })
                .then((resp) => {
                    props.setResult(resp.data.value)
                })
        }
        
    }, [admintoken])

    return (
        <div>
            <Input onInput={(e) => { filter(e.target.value) }} placeholder={`${props.searchPlaceholder.charAt(0).toUpperCase() + props.searchPlaceholder.slice(1)}`} style={{ width: '100%' }}>
                <ui5-icon id="searchIcon" slot="icon" name="search"></ui5-icon>
            </Input>
        </div>
    )
}

export default SearchBar