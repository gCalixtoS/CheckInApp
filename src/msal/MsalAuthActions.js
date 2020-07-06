export const login = () => ({
    type:'LOGIN',
    payload:{
        sysadmin:localStorage.getItem('sysadmin'),
        idtoken:localStorage.getItem("idtoken"),
        accesstoken:localStorage.getItem("idtoken")
    }
})