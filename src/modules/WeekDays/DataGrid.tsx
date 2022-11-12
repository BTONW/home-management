import styled from '@emotion/styled'
import { GridCellProps } from '@progress/kendo-react-grid'
import { FC, ReactElement, JSXElementConstructor } from 'react'
import { DataGridColumn } from '@hm-dto/components.dto'
import ComponentDataGrid from '@hm-components/DataGrid'

interface Props {
  rows: any[]
  columns: DataGridColumn[]
}

interface CellSummaryProps {
  color: string
  topBorderWidth: number
}

// ----------- ---------------------

const CellSummary = styled('td')<CellSummaryProps>`
  color: ${props => props.color};
  font-weight: bold !important;
  border-width: ${props => props.topBorderWidth}px 0 0 0 !important;
`

const CellCostOfLiving = styled('td')`
  color: #bab8b8;
  font-weight: bold !important;
  border-width: 0 0 1px 0 !important;
`

const CellNormal = styled('td')`
  border-width: 0 0 0 0 !important;
`

const DataGrid: FC<Props> = ({ rows, columns }) => {

  const handleCell = (
    cell: ReactElement<HTMLTableCellElement, string | JSXElementConstructor<any>> | null,
    { dataItem, field, ...cellProps }: GridCellProps
  ) => {
    if (dataItem.isBalance || dataItem.isTotal) {
      const color = field === 'Price' && dataItem.isBalance
        ? parseFloat(dataItem[field as string]) < 0
          ? 'red'
          : 'green'
        : 'inherit'
      return (
        <CellSummary
          color={color}
          className={cellProps.className}
          topBorderWidth={dataItem.isTotal ? 0 : 1}
        >
          {dataItem[field as string]}
        </CellSummary>
      )
    }
    if (dataItem.isCostOfLiving) {
      return (
        <CellCostOfLiving className={cellProps.className}>
          {dataItem[field as string]}
        </CellCostOfLiving>
      )
    }
    return (
      <CellNormal className={cellProps.className}>
        {dataItem[field as string]}
      </CellNormal>
    )
  }

  return (
    <ComponentDataGrid
      rows={rows}
      columns={columns}
      config={{
        cellRender: handleCell
      }}
    />
  )
}

export default DataGrid