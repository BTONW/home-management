import { FC } from 'react'
import { Snackbar, SnackbarProps, Alert, AlertProps } from '@mui/material'

interface Props {
  open?: boolean
  message: string
  onClose?: () => void
  autoHideDuration?: number
  severity?: AlertProps['severity']
  anchorOrigin?: SnackbarProps['anchorOrigin']
}

export const SnackAlert: FC<Props> = ({
  onClose,
  message,
  severity,
  open = false,
  autoHideDuration = 2000,
  anchorOrigin = {
    vertical: 'top',
    horizontal: 'center'
  }
}) => (
  <Snackbar
    open={open}
    anchorOrigin={anchorOrigin}
    autoHideDuration={autoHideDuration}
    onClose={() => {
      if (onClose) {
        onClose()
      }
    }}
  >
    <Alert
      severity={severity}
      sx={{ width: '100%' }}
      onClose={() => {
        if (onClose) {
          onClose()
        }
      }}
    >{message}</Alert>
  </Snackbar>
)

export default SnackAlert