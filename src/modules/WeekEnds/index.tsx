import { FC } from 'react'
import { Grid } from '@mui/material'

const Dashboard: FC = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={4}>
        Weekends
      </Grid>
    </Grid>
  )
}

export default Dashboard