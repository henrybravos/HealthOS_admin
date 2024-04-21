import { createContext, useContext } from "react"

import { useAuthentication } from "../hooks"

type AppContextType = ReturnType<typeof useAuthentication>
export const AppContext = createContext<AppContextType | null>(null)

export const useAppContext = () => {
  const ctx = useContext(AppContext)
  if (!ctx) {
    throw new Error("should useAppContext in a AppProvider")
  }
  return ctx
}
