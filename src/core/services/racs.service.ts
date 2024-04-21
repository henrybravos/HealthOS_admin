import { COLLECTIONS } from "@core/config"
import { EntityService, WhereQuery } from "@core/services"
import { Racs, UserInfo } from "@core/types"
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore"

const RacsService = {
  getRacsByUser: async (user: UserInfo) => {
    if (!user || !user.id) {
      throw new Error("User not found")
    }
    const whereFields: WhereQuery[] = [
      {
        fieldPath: "user.id",
        op: "==",
        value: user.id
      }
    ]
    return EntityService.getDocumentsByQuery<Racs>(COLLECTIONS.racs, whereFields, "createdAt")
  },
  addDocument: async (data: Racs) => {
    return EntityService.addDocument(COLLECTIONS.racs, data)
  },
  setDocument: async ({ data, uuid }: { data: Racs; uuid: string }) => {
    return EntityService.setDocument(COLLECTIONS.racs, data, uuid)
  },
  getRacsPagination: async ({
    pageSize,
    mode,
    documentId
  }: {
    pageSize: number
    mode: "after" | "before" | "start"
    documentId?: string
  }) => {
    return EntityService.getDocumentsPagination({
      collectionName: COLLECTIONS.racs,
      orderField: "openAt",
      whereFields: [],
      pageSize,
      mode,
      documentId
    })
  }
}
export { RacsService }
