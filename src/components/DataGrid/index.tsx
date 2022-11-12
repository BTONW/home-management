import { FC } from 'react'
import { DataGridColumn } from '@hm-dto/components.dto'
import { Grid, GridProps, GridColumn } from '@progress/kendo-react-grid'

interface Props  {
  config?: GridProps
  rows: any[]
  columns: DataGridColumn[]
}

const DataGrid: FC<Props> = ({
  config = {},
  rows,
  columns
}) => {
  return (
    <Grid
      resizable
      data={rows}
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
