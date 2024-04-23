import { COLLECTIONS } from "@core/config/collections"
import { db } from "@core/config/firebase-config"
import { Company, EventType, Occupation, Place, UnsafeActCondition } from "@core/types"
import {
  DocumentData,
  FieldPath,
  QuerySnapshot,
  WhereFilterOp,
  addDoc,
  collection,
  doc,
  endBefore,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  startAfter,
  startAt,
  where
} from "firebase/firestore"

const convertToEntity = <T>(querySnapshot: QuerySnapshot<DocumentData, DocumentData>): T[] => {
  const documents: T[] = []
  querySnapshot.forEach((doc) => {
    const row = doc.data()
    documents.push({
      id: doc.id,
      ...row
    } as T)
  })
  return documents || []
}

const addDocument = async <T>(collectionName: string, data: T): Promise<T> => {
  const docRef = await addDoc(collection(db!, collectionName), data as unknown)
  return {
    id: docRef.id,
    ...data
  }
}

const setDocument = async <T>(collectionName: string, data: T, uuid: string): Promise<T> => {
  await setDoc(doc(db!, collectionName, uuid), data as unknown)
  return {
    id: uuid,
    ...data
  }
}
const getAllDocuments = async <T>(collectionName: string, orderByField?: keyof T): Promise<T[]> => {
  if (!db) return []
  if (!orderByField) {
    const querySnapshot = await getDocs(collection(db!, collectionName))
    return convertToEntity<T>(querySnapshot)
  } else {
    const querySnapshot = await getDocs(
      query(collection(db!, collectionName), orderBy(orderByField as string, "desc"))
    )
    return convertToEntity<T>(querySnapshot)
  }
}
const getDocumentById = async <T>(collectionName: string, uuid: string): Promise<T | null> => {
  const docRef = doc(db!, collectionName, uuid)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as T
  } else {
    return null
  }
}
export type WhereQuery = { fieldPath: string | FieldPath; op: WhereFilterOp; value: unknown }
const getDocumentsByQuery = async <T>(
  collectionName: string,
  wheresArr: WhereQuery[],
  orderByField: string | undefined
): Promise<T[]> => {
  const wheres = wheresArr.map((q) => where(q.fieldPath, q.op, q.value))
  let q = query(collection(db!, collectionName), ...wheres)
  if (orderByField) {
    q = query(collection(db!, collectionName), ...wheres, orderBy("createdAt", "desc"))
  }
  const querySnapshot = await getDocs(q)
  return convertToEntity<T>(querySnapshot)
}
type DocumentsPagination = {
  collectionName: string
  whereFields: WhereQuery[]
  orderField: string
  pageSize: number
  mode: "after" | "before" | "start"
  documentId?: string
}
const getDocumentsPagination = async (params: DocumentsPagination) => {
  if (!db) return
  const collectionRef = collection(db, params.collectionName)
  const limitRef = limit(params.pageSize)
  const orderRef = orderBy(params.orderField, "desc")
  let queryRef = query(collectionRef, orderRef, limitRef)

  if (params.documentId && params.mode) {
    const docSnap = await getDoc(doc(db, params.collectionName, params.documentId))
    const init = {
      after: startAfter(docSnap),
      before: endBefore(docSnap),
      start: startAt(docSnap)
    }
    queryRef = query(collectionRef, orderRef, init[params.mode], limitRef)
  }
  if (params.whereFields.length > 0) {
    params.whereFields.forEach((w) => {
      const whereRef = where(w.fieldPath, w.op, w.value)
      queryRef = query(queryRef, whereRef)
    })
  }
  const documentSnapshots = await getDocs(queryRef)
  const data = documentSnapshots.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data()
    }
  })
  const queryCount = query(collectionRef)
  const snapshot = await getCountFromServer(queryCount)
  const totalSize = snapshot.data().count
  return { data, totalSize }
}

const EntityService = {
  getAllDocuments,
  getDocumentsByQuery,
  getDocumentById,
  getDocumentsPagination,
  addDocument,
  setDocument
}

const OccupationService = {
  getAllOccupations: async (): Promise<Occupation[]> => {
    return EntityService.getAllDocuments<Occupation>(COLLECTIONS.occupations)
  }
}

const CompanyService = {
  getAllCompanies: async (): Promise<Company[]> => {
    return EntityService.getAllDocuments<Company>(COLLECTIONS.companies)
  }
}
const PlaceService = {
  getAllPlaces: async () => {
    return EntityService.getAllDocuments<Place>(COLLECTIONS.places)
  }
}
const ActService = {
  getAllActs: async () => {
    return EntityService.getAllDocuments<UnsafeActCondition>(COLLECTIONS.unsafeActs)
  }
}
const ConditionService = {
  getAllConditions: async () => {
    return EntityService.getAllDocuments<UnsafeActCondition>(COLLECTIONS.unsafeConditions)
  }
}
const EventTypeService = {
  getAllEventTypes: async () => {
    return EntityService.getAllDocuments<EventType>(COLLECTIONS.eventTypes)
  }
}

export {
  EntityService,
  OccupationService,
  CompanyService,
  ActService,
  ConditionService,
  PlaceService,
  EventTypeService
}
