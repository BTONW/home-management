import styled from '@emotion/styled'
import { isUndefined } from 'lodash'
import { GridCellProps, GridRowClickEvent } from '@progress/kendo-react-grid'
import { FC, ReactElement, JSXElementConstructor, useState } from 'react'
import { DataGridColumn } from '@hm-dto/components.dto'
import InputCost from '@hm-components/InputCost'
import ComponentDataGrid from '@hm-components/DataGrid'

export interface SubmitOption {
  date: string
  value: number
  costValueId: number
}

interface Props {
  rows: any[]
  date: string
  columns: DataGridColumn[]
  onSubmit?: (options: SubmitOption) => void
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
  color: #BAB8B8;
  font-weight: bold !important;
  border-width: 0 0 1px 0 !important;
`

const CellNormal = styled('td')`
  border-width: 0 0 0 0 !important;
  height: 60px;
`

const DataGrid: FC<Props> = ({ date, rows, columns, onSubmit }) => {
  const [editRow, setEditRow] = useState<number | null>(null)

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
          {field === 'Price'
            ? parseFloat(dataItem[field as string])
                .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            : dataItem[field as string]
          }
        </CellSummary>
      )
    }

    if (dataItem.isCostOfLiving) {
      return (
        <CellCostOfLiving className={cellProps.className}>
          {field === 'Price'
            ? parseFloat(dataItem[field as string])
                .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            : dataItem[field as string]
          }
        </CellCostOfLiving>
      )
    }

    if (dataItem.CostValueId === editRow && field === 'Price') {
      return (
        <CellNormal className={cellProps.className}>
          <InputCost
            size='small'
            isMultiSubmit={false}
            defaultValue={dataItem.Price}
            field={editRow?.toLocaleString() as string}
            onEnter={(field, val) => {
              if (onSubmit && val !== dataItem.Price) {
                onSubmit({
                  date,
                  value: parseFloat(val),
                  costValueId: parseFloat(field)
                })
              }
              setEditRow(null)
            }}
          />
        </CellNormal>
      )
    }

    return (
      <CellNormal className={cellProps.className}>
        {field === 'Price'
          ? parseFloat(dataItem[field as string])
              .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          : dataItem[field as string]
        }
      </CellNormal>
    )
  }

  const handleRowClick = ({ dataItem }: GridRowClickEvent) => {
    setEditRow(
      isUndefined(dataItem.CostValueId) || dataItem.CostValueId === editRow
        ? null
        : dataItem.CostValueId
    )
  }

  return (
    <ComponentDataGrid
      rows={rows}
      columns={columns}
      config={{
        cellRender: handleCell,
        onRowClick: handleRowClick
      }}
    />
  )
}

export default DataGrid