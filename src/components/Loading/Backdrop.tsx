import { FC } from 'react'
import { Backdrop, CircularProgress } from '@mui/material'

interface Props {
  loading?: boolean
}

export const BackdropLoading: FC<Props> = ({ loading = false }) => (
  <Backdrop
    open={loading}
    sx={{
      color: '#FFF',
      zIndex: (theme) => theme.zIndex.drawer + 1,
    }}
  >
    <CircularProgress color='inherit' />
  </Backdrop>
)

export default BackdropLoading