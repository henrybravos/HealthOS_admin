import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import { PATHS } from "@common/constants"
import { auth } from "@core/config"
import { AuthService } from "@core/services"
import { UserInfo, UserRoleEnum } from "@core/types"
import { onAuthStateChanged } from "firebase/auth"

export const useAuthentication = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>(undefined)
  const [loadingAuth, setLoadingAuth] = useState(true)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  useEffect(() => {
    onAuthStateChangedApi()
  }, [])

  const onAuthStateChangedApi = () => {
    if (auth) {
      setLoadingAuth(true)
      onAuthStateChanged(auth, (user) => {
        if (user?.uid) {
          getDataExtra(user.uid)
        } else {
          handleSignOut()
          setLoadingAuth(false)
        }
      })
    }
  }
  const getDataExtra = async (authId: string) => {
    const extra = await AuthService.getExtraData({ authId })
    const isActive = !extra?.deletedAt
    const hasPermission = hasPermissions(extra?.roles || [])
    if (extra && isActive && hasPermission) {
      setUserInfo(extra)
      const isPathLogin = pathname.includes(PATHS.LOGIN)
      const pathRedirect = isPathLogin ? PATHS.HOME : pathname
      navigate(pathRedirect)
    } else {
      handleSignOut()
      setUserInfo(undefined)
    }
    setTimeout(() => {
      setLoadingAuth(false)
    }, 10)
  }
  const hasPermissions = (roles: UserRoleEnum[]) => {
    const rolesAllowed = [UserRoleEnum.ADMIN, UserRoleEnum.VISUALIZER]
    return roles.some((role) => rolesAllowed.includes(role))
  }
  const hasWriterPermissions = () => {
    return userInfo?.roles.includes(UserRoleEnum.ADMIN)
  }
  const handleSignOut = () => {
    AuthService.signOut()
    setUserInfo(undefined)
  }
  return {
    userInfo,
    loadingAuth,
    isAuthenticated: !!userInfo?.id,
    handleSignOut,
    canWriter: hasWriterPermissions()
  }
}
