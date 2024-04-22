import { ChangeEvent, useState } from "react"

import { isValidEmail } from "@common/helpers"
import { useFetchApi } from "@common/hooks"
import { AuthService } from "@core/services"

const initialFormAuth = {
  email: {
    value: "",
    error: ""
  },
  password: {
    value: "",
    error: ""
  }
}
export const useLogin = () => {
  const [formAuth, setFormAuth] = useState<typeof initialFormAuth>(initialFormAuth)
  const [loadingAuth, _, fetchAuth, errorAuth] = useFetchApi(AuthService.signIn)

  const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    const email = e.currentTarget.value
    setFormAuth({
      ...formAuth,
      email: {
        value: email,
        error: isValidEmail(email) ? "" : "Email inválido"
      }
    })
  }
  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    const password = e.currentTarget.value
    setFormAuth({
      ...formAuth,
      password: {
        value: password,
        error: password.length > 0 ? "" : "Contraseña inválida"
      }
    })
  }
  const submitAuth = () => {
    const email = formAuth.email.value
    const password = formAuth.password.value
    fetchAuth({ email, password })
  }
  return {
    email: formAuth.email.value,
    password: formAuth.password.value,
    loadingAuth,
    error: errorAuth,
    onChangeEmail,
    onChangePassword,
    submitAuth
  }
}
