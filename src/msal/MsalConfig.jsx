export const msalConfig = {
    authority: 'https://login.microsoftonline.com/common',
    clientId: process.env.REACT_APP_AZURE_CLIENT_ID,
    redirectUri: process.env.REACT_APP_ROOT
}