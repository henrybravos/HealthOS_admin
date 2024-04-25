import {
  ClassificationEvent,
  Company,
  EventType,
  Place,
  UnsafeActCondition,
  UserInfo
} from "@core/types"
import { Timestamp } from "firebase/firestore"

export enum StatusRacs {
  CLOSED = "CERRADO",
  PENDING = "PENDIENTE"
}
export enum TypeRacs {
  ACT = "ACTO SUBÉSTANDAR",
  CONDITION = "CONDICIÓN SUBÉSTANDAR",
  INCIDENT = "INCIDENTE",
  GOOD_PRACTICE = "BUENA PRÁCTICA"
}
export type EvidenceRacs = {
  openUri?: string
  closeUri?: string
}
export type Racs = {
  id: string
  createdAt: Timestamp
  openAt: Timestamp
  closeAt?: Timestamp
  act?: UnsafeActCondition
  user: UserInfo
  type: TypeRacs
  place: Place
  company: Company
  evidence: EvidenceRacs
  eventType: EventType
  condition?: UnsafeActCondition
  description: string
  classification: ClassificationEvent
  controlCondition: string
  status: StatusRacs
}
export type MonthYear = string

export type RacsUser = {
  month: string
  userId: string
  racsIds: string[]
  racsGoal: number
  racsQuantity: number
}

export type RacsUserReport = {
  user: UserInfo
  months: Record<MonthYear, RacsUser>
}
