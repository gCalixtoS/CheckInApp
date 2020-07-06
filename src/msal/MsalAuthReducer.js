const INITIAL_STATE = {}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                sysadmin: localStorage.getItem('sysadmin'),
                idtoken: localStorage.getItem("idtoken"),
                accesstoken: localStorage.getItem("accesstoken"),
                admintoken: localStorage.getItem('admintoken')
            }
        default:
            return state
    }
}