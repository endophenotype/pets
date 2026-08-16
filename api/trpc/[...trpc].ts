import type { IncomingMessage, ServerResponse } from 'http'

import { createBackendApp, type BackendApp } from '../../backend/src/app'

let backendAppPromise: Promise<BackendApp> | null = null

const getBackendApp = () => {
  backendAppPromise ??= createBackendApp({ serveWebApp: false })
  return backendAppPromise
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const { expressApp } = await getBackendApp()
  expressApp(req, res)
}
