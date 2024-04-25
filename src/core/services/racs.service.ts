import { COLLECTIONS } from "@core/config"
import { db } from "@core/config/firebase-config"
import { EntityService, WhereQuery, convertToEntity } from "@core/services"
import { Racs, UserInfo } from "@core/types"
import { RacsUser } from "@features/home"
import { collection, getDocs } from "firebase/firestore"

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
  },
  getReportByMonth: async (months: string[]) => {
    if (!db) return
    const promises = months.map(async (month) => {
      const docsRef = await getDocs(collection(db!, COLLECTIONS.reports, COLLECTIONS.racs, month))
      const userRacsMonth = convertToEntity<RacsUser>(docsRef)
      return {
        month,
        userRacsMonth
      }
    })
    try {
      const result = await Promise.all(promises)
      return result.flat()
    } catch (error) {
      console.error("Error al obtener los documentos:", error)
      throw error
    }
  }
}
export { RacsService }
