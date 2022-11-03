import { FC } from 'react'
import { Grid } from '@mui/material'
import CardMedia from '@hm-components/CardMedia'

const Dashboard: FC = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={4}>
        <CardMedia />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <CardMedia />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <CardMedia />
      </Grid>
    </Grid>
  )
}

export default Dashboard