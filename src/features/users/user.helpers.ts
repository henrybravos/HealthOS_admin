import { isValidEmail } from "@common/helpers"
import { ErrorsUserForm, UserForm } from "@features/users/user.types"

const validateUserForm = (userForm: Partial<UserForm>) => {
  const errors: ErrorsUserForm = {}
  if (!userForm?.id && (userForm.password?.length || 0) < 5) {
    errors.password = "La contraseña debe tener al menos 5 caracteres"
  }
  if (!userForm?.name) {
    errors.name = "El nombre es requerido"
  }
  if (!userForm?.dni) {
    errors.dni = "El DNI es requerido"
  }
  if (!userForm?.surname) {
    errors.surname = "El apellido es requerido"
  }
  if (!isValidEmail(userForm?.email || "")) {
    errors.email = "El correo no es válido"
  }
  if (!userForm?.occupation || !userForm.occupation.id) {
    errors.occupation = "La ocupación es requerida"
  }
  if (!userForm?.roles?.length) {
    errors.roles = "El rol es requerido"
  }
  return { errors, isValid: !Object.keys(errors).length }
}
export { validateUserForm }
