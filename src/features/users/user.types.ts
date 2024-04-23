import { UserInfo } from "@core/types"

export type ErrorsUserForm = Partial<Record<keyof UserInfo | "password", string>>
export type UserForm = Partial<UserInfo & { password: string }>
export type UserFormComponentParams = {
  userEdit?: UserInfo
  fetchUsers: () => void
  handleCloseForm: () => void
}
