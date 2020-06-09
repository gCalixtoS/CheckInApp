import React from 'react'

function CreateButton(props) {

    var openDialog = (attrId) => {
        props.setState(attrId)
        props.refDialog.current.open()
    }

    return (
        <ui5-button design="Positive" icon="add" onClick={e => { openDialog(false) }}>Novo</ui5-button>
    )
}

export default CreateButton