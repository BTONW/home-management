import { BitStatus, BudgetCode } from './utils.dto'

export interface BodyCostValues {
  id: number
  is_active: BitStatus
  created_at: string
  updated_at: string
  cost_amount: number
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

export interface BodyBudgets {
  id: number
  code: BudgetCode
  created_at: string
  updated_at: string
  is_active: BitStatus
  budget_amount: number
}