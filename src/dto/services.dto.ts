import { BitStatus } from './utils.dto'

export interface BodyCostValues {
  id: number
  name: string
  image: string
  is_active: BitStatus
  is_regular: BitStatus
  created_at: string
  updated_at: string
}

export interface BodyProducts {
  id: number
  name: string
  image: string
  is_active: BitStatus
  is_regular: BitStatus
  created_at: string
  updated_at: string

  cost_values?: BodyCostValues[]
}