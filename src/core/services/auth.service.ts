import { COLLECTIONS, auth } from "@core/config"
import { EntityService } from "@core/services"
import { UserInfo } from "@core/types"
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth"
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
    return await EntityService.getAllDocuments(COLLECTIONS.usersExtra, "createAt")
  },
  getExtraData: async ({ uuid }: { uuid: string }) => {
    const extra = await EntityService.getDocumentById<UserInfo>(COLLECTIONS.usersExtra, uuid)
    return extra
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
    if (!auth) return
    let id = user.id
    if (!id) {
      const credential = await createUserWithEmailAndPassword(auth, email, password)
      id = credential.user.uid
      user.createAt = Timestamp.fromDate(new Date())
    }
    if (!id) return
    return await EntityService.setDocument(COLLECTIONS.usersExtra, user, id)
  },
  sendPasswordResetEmail: async ({ email }: { email: string }) => {
    if (!auth) return
    await sendPasswordResetEmail(auth, email)
    return "enviendo correctamente"
  },
  deleteUser: async ({ id }: { id: string }) => {
    return await EntityService.setDocument(
      COLLECTIONS.usersExtra,
      {
        deleteAt: Timestamp.fromDate(new Date())
      },
      id
    )
  }
}
export { AuthService }
