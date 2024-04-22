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
    return await EntityService.getAllDocuments(COLLECTIONS.usersExtra)
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
    }
    if (!id) return
    user.createAt = Timestamp.fromDate(new Date())
    return await EntityService.setDocument(COLLECTIONS.usersExtra, user, id)
  },
  sendPasswordResetEmail: async ({ email }: { email: string }) => {
    if (!auth) return
    await sendPasswordResetEmail(auth, email)
    return "enviendo correctamente"
  }
}
export { AuthService }
