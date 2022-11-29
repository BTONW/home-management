import { FC } from 'react'
import { Grid, Divider } from '@mui/material'

interface Props {
  label: string
  value: number
  underline?: 'one' | 'two'
  format?: Intl.NumberFormatOptions
}

const MatchSum: FC<Props> = ({
  value,
  label,
  underline,
  format = {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  }
}) => {
  return (
    <Grid container sx={{ color: '#FFF', bgcolor: '#F96666', }}>
      <Grid item xs={6} sx={{ p: 1 }}>{label}</Grid>
      <Grid item xs={6} sx={{ p: 1, textAlign: 'right' }}>
        {value.toLocaleString(undefined, format)}
        {underline === 'one' &&
          <Divider sx={{ mt: 0.5, bgcolor: '#4C4C4C' }}  />
        }
        {underline === 'two' &&
          <>
            <Divider sx={{ mt: 0.5, bgcolor: '#4C4C4C' }}  />
            <Divider sx={{ mt: 0.5, bgcolor: '#4C4C4C' }} />
          </>
        }
      </Grid>
    </Grid>
  )
}

export default MatchSum