import React from 'react'

function CreateButton(props) {

    var openDialog = (attrId) => {
        props.setState(attrId)
        props.refDialog.current.open()
    }

    return (
        <ui5-button icon="edit" aria-labelledby="lblEdit" style={{ margin: '0 8px 8px 0' }} onClick={e => { openDialog(props.editId) }}></ui5-button>
    )
}

export default CreateButton