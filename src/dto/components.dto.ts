import { GridColumnProps, } from '@progress/kendo-react-grid'

export interface DataGridColumn extends GridColumnProps {
  show: boolean
}

export interface BreadCrumbs {
  text: string
  path?: string
}