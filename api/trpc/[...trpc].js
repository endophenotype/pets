const { createBackendApp } = require('../../backend/dist/backend/src/app')

let backendAppPromise = null

const getBackendApp = () => {
  backendAppPromise ||= createBackendApp({ serveWebApp: false })
  return backendAppPromise
}

module.exports = async function handler(req, res) {
  const { expressApp } = await getBackendApp()
  expressApp(req, res)
}
