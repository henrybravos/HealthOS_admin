import { COLLECTIONS, auth } from "@core/config"
import { EntityService, WhereQuery } from "@core/services"
import { UserInfo } from "@core/types"
import { sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { Timestamp } from "firebase/firestore"

const AuthService = {
  signIn: async ({ email, password }: { email: string; password: string }) => {
    if (!auth) return
    const responseAuth = await signInWithEmailAndPassword(auth, email, password)
    return responseAuth
  },
  signOut: async () => {
    if (!auth) return
    await signOut(auth)
    return true
  },
  getAllUsers: async () => {
    return await EntityService.getAllDocuments<UserInfo>(COLLECTIONS.usersExtra, "createdAt")
  },
  getExtraData: async ({ authId }: { authId: string }) => {
    const where: WhereQuery[] = [
      {
        fieldPath: "authId",
        op: "==",
        value: authId
      }
    ]
    const extra = await EntityService.getDocumentsByQuery<UserInfo>(
      COLLECTIONS.usersExtra,
      where,
      undefined
    )
    if (extra.length === 0) return null
    return extra[0]
  },
  createOrUpdateUser: async ({
    email,
    password,
    user
  }: {
    email: string
    password: string
    user: UserInfo
  }) => {
    if (!user.id) {
      user.password = password // in functions remove password after create en auth
      user.email = email
      user.createdAt = Timestamp.fromDate(new Date())
      return await EntityService.addDocument(COLLECTIONS.usersExtra, user)
    }
    const { id, ...restUser } = user
    const response = await EntityService.setDocument(COLLECTIONS.usersExtra, restUser, id)
    return { ...response, id }
  },
  sendPasswordResetEmail: async ({ email }: { email: string }) => {
    if (!auth) return
    await sendPasswordResetEmail(auth, email)
    return "enviendo correctamente"
  },
  activeOrDisabledUser: async ({ user }: { user: UserInfo }) => {
    if (!user.id) return
    const { id, deletedAt, ...restUser } = user
    const userUpdate = deletedAt ? restUser : { ...restUser, deletedAt: Timestamp.now() }
    return await EntityService.setDocument(COLLECTIONS.usersExtra, userUpdate, id)
  }
}
export { AuthService }
