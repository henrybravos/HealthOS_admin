import { getMonthsBetweenDates } from "@common/helpers"
import { COLLECTIONS } from "@core/config"
import { db } from "@core/config/firebase-config"
import { EntityService, WhereQuery } from "@core/services"
import { MonthYear, Racs, UserInfo } from "@core/types"
import dayjs from "dayjs"
import { Timestamp } from "firebase/firestore"

type RacsBetweenParams = { dateStart: dayjs.Dayjs; dateEnd: dayjs.Dayjs }
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
  getRacsBetweenDates: async ({ dateStart, dateEnd }: RacsBetweenParams) => {
    if (!db) return {}
    const months = getMonthsBetweenDates(dateStart, dateEnd)
    if (months.length === 0) return {}
    const startDay = dateStart.startOf("day")
    const endDateDay = dateEnd.endOf("day")
    const wheres: WhereQuery[] = [
      {
        fieldPath: "openAt",
        op: ">=",
        value: Timestamp.fromDate(startDay.toDate())
      },
      {
        fieldPath: "createdAt",
        op: "<=",
        value: Timestamp.fromDate(endDateDay.toDate())
      }
    ]
    const racs = await EntityService.getDocumentsByQuery<Racs>(
      COLLECTIONS.racs,
      wheres,
      "createdAt"
    )

    const racsUser: Record<MonthYear, Racs[]> = {}
    racs.forEach((rac) => {
      const monthYear = dayjs(rac.openAt.toDate()).format("YYYY-MM") as MonthYear
      if (!racsUser[monthYear]) {
        racsUser[monthYear] = [rac]
      } else {
        racsUser[monthYear].push(rac)
      }
    })
    return racsUser
  }
}
export { RacsService }
