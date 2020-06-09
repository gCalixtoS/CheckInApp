import React, {useEffect} from 'react'

import { Input } from '@ui5/webcomponents-react/lib/Input'
import axios from 'axios'

function SearchBar(props) {

    const url = process.env.REACT_APP_CHECKINAPI

    var filter = (search) => {
        if (search !== '') {
            axios.get(`${url}${props.searchObject}?$filter=contains(${props.searchField},'${search}')`)
                .then((resp) => {
                    props.setResult(resp.data.value)
                })
        } else {
            axios.get(`${url}${props.searchObject}`)
                .then((resp) => {
                    props.setResult(resp.data.value)
                })
        }

    }

    useEffect(() => {
        axios.get(`${url}${props.searchObject}`)
            .then((resp) => {
                props.setResult(resp.data.value)
            })
    }, [props.refresh])

    useEffect(() => {
        axios.get(`${url}${props.searchObject}`)
            .then((resp) => {
                props.setResult(resp.data.value)
            })
    }, [])

    return (
        <div>
            <Input onInput={(e) => { filter(e.target.value) }} placeholder={`Digite o nome do ${props.searchPlaceholder}.`} style={{ width: '100%' }}>
                <ui5-icon id="searchIcon" slot="icon" name="search"></ui5-icon>
            </Input>
        </div>
    )
}

export default SearchBar