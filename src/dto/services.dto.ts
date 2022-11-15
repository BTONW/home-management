import { BitStatus, BudgetCode, PaymentType } from './utils.dto'

export interface BodyCostValues {
  id: number
  is_active: BitStatus
  created_at: string
  updated_at: string
  cost_amount: number
}

export interface BodyCreateCostValues {
  date: string
  product_id: number
  cost_amount: number
  payment: PaymentType
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

export interface BodyBalance {
  id: number
  date: string
  created_at: string
  updated_at: string
  is_active: BitStatus
  balance_amount: number
}

export interface BodyUpsertBalance {
  date: string
  balance_amount: number
}