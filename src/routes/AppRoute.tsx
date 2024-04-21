import { Navigate, Route, Routes } from "react-router-dom"

import { Loading } from "@common/components"
import { Layout } from "@common/components/layout"
import { PATHS } from "@common/constants"
import { useAppContext } from "@context/useAppContext"
import LoginManagement from "@features/login/LoginManagement"
import { RacsListManagement } from "@features/racs/RacsListManagement"

type PrivateRouterProps = {
  children: JSX.Element
  title: string
}
const PrivateRouter = ({ children, title }: PrivateRouterProps) => {
  const { isAuthenticated, loadingAuth } = useAppContext()
  if (loadingAuth) {
    return <Loading />
  }
  if (isAuthenticated) {
    return <Layout title={title}>{children}</Layout>
  }
  return <Navigate replace to="/login" />
}

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  return children
}

const AppRoute = () => {
  return (
    <Routes>
      <Route
        path={PATHS.LOGIN}
        element={
          <PublicRoute>
            <LoginManagement />
          </PublicRoute>
        }
      />
      <Route
        path={PATHS.HOME}
        element={
          <PrivateRouter title="Home">
            <h1>home</h1>
          </PrivateRouter>
        }
      />
      <Route
        path={PATHS.RACS}
        element={
          <PrivateRouter title="RACS">
            <RacsListManagement />
          </PrivateRouter>
        }
      />
      <Route
        path={PATHS.USERS}
        element={
          <PrivateRouter title="Usuarios">
            <h1>users</h1>
          </PrivateRouter>
        }
      />
      <Route path="*" element={<h1>Not found</h1>} />
    </Routes>
  )
}

export default AppRoute
