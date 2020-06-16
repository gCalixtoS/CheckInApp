import React from 'react'

function CreateButton(props) {

    var openDialog = (attrId) => {
        props.setState(attrId)
        props.refDialog.current.open()
    }

    return (
        <ui5-button design="Emphasized" icon="add" onClick={e => { openDialog(false) }}>Novo {props.placeholder}</ui5-button>
    )
}

export default CreateButton