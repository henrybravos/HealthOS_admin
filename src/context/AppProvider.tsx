import { ReactElement } from "react"

import { useAuthentication } from "../hooks"
import { AppContext } from "./useAppContext"

export const AppProvider = ({ children }: { children: ReactElement }) => {
  const ctxAuth = useAuthentication()
  return <AppContext.Provider value={ctxAuth}>{children}</AppContext.Provider>
}
