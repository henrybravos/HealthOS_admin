import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { PATHS } from "@common/constants"
import { auth } from "@core/config"
import { AuthService } from "@core/services"
import { UserInfo } from "@core/types"
import { onAuthStateChanged } from "firebase/auth"

export const useAuthentication = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>(undefined)
  const [loadingAuth, setLoadingAuth] = useState(true)

  const navigate = useNavigate()
  useEffect(() => onAuthStateChangedApi, [])

  const onAuthStateChangedApi = () => {
    if (auth) {
      setLoadingAuth(true)
      onAuthStateChanged(auth, (user) => {
        console.log({ user })
        if (user?.uid) {
          getDataExtra(user.uid)
        } else {
          handleSignOut()
          setLoadingAuth(false)
        }
      })
    }
  }
  const getDataExtra = async (id: string) => {
    const extra = await AuthService.getExtraData({ uuid: id })
    if (extra) {
      setUserInfo(extra)
      navigate(PATHS.HOME)
    } else {
      handleSignOut()
      setUserInfo(undefined)
    }
    setTimeout(() => {
      setLoadingAuth(false)
    }, 10)
  }
  const handleSignOut = () => {
    AuthService.signOut()
    setUserInfo(undefined)
  }
  return {
    userInfo,
    loadingAuth,
    isAuthenticated: !!userInfo?.id,
    handleSignOut
  }
}
