import { Occupation } from "@core/types/occupations"
import { Timestamp } from "firebase/firestore"

export type Auth = {
  email: string
  token: string
  refreshToken: string
  expirationTime: number
}
export type User = {
  id: string
  displayName: string
  auth: Auth
}
export enum UserRoleEnum {
  NONE = "",
  ADMIN = "admin",
  REGISTER = "register"
}
export enum UserCategoryEnum {
  NONE = "",
  N1 = "N1",
  N2 = "N2",
  N3 = "N3"
}
export type UserInfo = {
  id: string
  dni: string
  name: string
  email: string
  surname: string
  phone: string
  address: string
  createAt: Timestamp
  occupation: Occupation
  category?: UserCategoryEnum
  racsGoals?: number
  roles: UserRoleEnum[]
}
