import { combineReducers } from 'redux'
import msalAuthReducer from '../msal/MsalAuthReducer'

const rootReducer = combineReducers({
    authToken : msalAuthReducer
})

export default rootReducer