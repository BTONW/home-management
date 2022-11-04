import { FC, useState, useEffect } from 'react'
import { Grid, GridProps, GridColumn } from '@progress/kendo-react-grid'
import { DataGridColumn } from '@hm-dto/components.dto'

interface Props  {
  config?: GridProps
  rows: any[]
  columns: DataGridColumn[]
}

const DataGrid: FC<Props> = ({
  config = {},
  columns
}) => {
  const [rows, setRows] = useState()

  return (
    <Grid
      resizable
      {...config}
    >
      {
        columns
          .filter(col => col.show)
          .map(({ children, ...col }, index) => (
            <GridColumn
              key={`${index}-${col.field}`}
              {...col}
              children={children
                ? (children as any)?.filter((child: any) => child.show)
                : undefined
              }
            />
        ))
      }
    </Grid>
  )
}

export default DataGrid
