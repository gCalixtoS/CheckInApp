import React, { useEffect, useState } from 'react'

import { msalConfig } from './MsalConfig'
import { UserAgentApplication } from 'msal'
import axios from 'axios'
import { useDispatch } from "react-redux"

import { getUserDetails } from '../graph/GraphService'
import { login } from './MsalAuthActions'

import { Loader } from '@ui5/webcomponents-react/lib/Loader'

export const msalAuth = new UserAgentApplication({
    auth: msalConfig
})



function WithAuth(HocComponent) {
    const dispatch = useDispatch()
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [user, setUser] = useState({})
    const [renewIframe, setRenewIframe] = useState(false)
    const [hasError, setHasError] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)

    const onSignIn = () => {
        msalAuth.loginRedirect({})
    }

    const onSignOut = () => {
        msalAuth.logout()
    }

    useEffect(() => {
        msalAuth.handleRedirectCallback(() => {
            let userAccount = msalAuth.getAccount()

            setUser(userAccount)
            setIsAuthenticated(true)
        }, (authErr, accountState) => {  // on fail
            console.log(authErr)

            setHasError(true)
            setErrorMessage(authErr.errorMessage)
        })

        if (msalAuth.isCallback(window.location.hash)) {
            setRenewIframe(true)
            return
        }

        let userAccount = msalAuth.getAccount()
        if (!userAccount) {
            msalAuth.loginRedirect({})
            return
        } else {
            setIsAuthenticated(true)
            setUser(userAccount)

        }

        let token
        msalAuth.acquireTokenSilent({
            scopes: ["user.read"]
        }).then(async (resp) => {
            token = resp
            var user = await getUserDetails(token.accessToken)

            localStorage.clear()

            localStorage.setItem("idtoken", token.idToken.rawIdToken)
            localStorage.setItem("accesstoken", token.accessToken)

            await axios.get(`${process.env.REACT_APP_CHECKINAPI_OAPI}login`, {
                headers: {
                    idtoken: localStorage.getItem("idtoken")
                }
            })
                .then((resp) => {
                    localStorage.setItem("admintoken", resp.data.token)
                    localStorage.setItem("sysadmin", resp.data.sysAdmin)

                    dispatch(login())
                    console.log(localStorage.getItem("sysadmin"))
                })
                .catch((error) => {
                    console.log(error)
                })
        }).catch(async (error) => {
            await msalAuth.acquireTokenRedirect({
                scopes: ["user.read"]
            })

            var user = await getUserDetails(token.accessToken)

            localStorage.setItem("idtoken", token.idToken.rawIdToken)
            localStorage.setItem("accesstoken", token.accessToken)

            await axios.get(`${process.env.REACT_APP_CHECKINAPI_OAPI}login`, {
                headers: {
                    idtoken: localStorage.getItem("idtoken")
                }
            })
                .then((resp) => {
                    localStorage.setItem("admintoken", resp.data.token)
                    localStorage.setItem("sysadmin", resp.data.sysAdmin)

                })
        })

    }, [])

    if (renewIframe) {
        return <div>hidden renew iframe - not visible</div>
    }

    if (isAuthenticated) {
        return <HocComponent auth={user} onSignIn={() => onSignIn()} onSignOut={() => onSignOut()}  />
    }

    if (hasError) {
        return <div></div>
    }

    return <Loader
            type="Indeterminate"
            delay={1000}
        />

}

export default WithAuth