import styled from '@emotion/styled'
import { GridCellProps, GridRowProps } from '@progress/kendo-react-grid'
import { FC, ReactElement, JSXElementConstructor, useState } from 'react'
import { DataGridColumn } from '@hm-dto/components.dto'

import ComponentDataGrid from '@hm-components/DataGrid'

interface Props {
  rows: any[]
  columns: DataGridColumn[]
  onSubmit?: (options: any) => void
}

// ------------------------------------

const Wrapper = styled('div')`
  .k-grid {
    th {
      padding: 16px 24px;
      border-width: 0 1px 0 1px;
      white-space: nowrap;
      &:last-child {
        border-width: 0 0 1px 1px;
      }
    }
    td {
      border-width: 0 1px 1px 1px;
      vertical-align: middle;
      &:last-child {
        border-width: 0 0 1px 0;
      }
    }
    tr:last-child {
      td:last-child {
        border-width: 0 0 0 0;
      }
    }
  }
`

const DataGrid: FC<Props> = ({ rows, columns }) => {

  const handleCell = (
    cell: ReactElement<HTMLTableCellElement, string | JSXElementConstructor<any>> | null,
    { dataItem, field, ...cellProps }: GridCellProps
  ) => {
    // if (field === 'Date') {
    //   const itemGroup = rows.filter(item => item.Date == dataItem.Date)
    //   if (itemGroup.findIndex(item => item.key == dataItem.key) == 0) {
    //     return (
    //       <td
    //         {...cell?.props as any}
    //         rowSpan={itemGroup.length}
    //       >
    //         {String(dataItem[field])}
    //       </td>
    //     )
    //   }
    //   return null
    // }
    return cell
  }

  return (
    <Wrapper>
      <ComponentDataGrid
        rows={rows}
        columns={columns}
        config={{
          resizable: false,
          cellRender: handleCell,
        }}
      />
    </Wrapper>
  )
}

export default DataGrid