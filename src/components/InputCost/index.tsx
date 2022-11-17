import { isEmpty } from 'lodash'
import { FC, ChangeEvent, useState } from 'react'
import {
  TextField,
  Typography,
  TextFieldProps,
  InputAdornment,
  CircularProgress
} from '@mui/material'

const InputCost: FC<TextFieldProps & {
  field: string
  loading?: boolean
  isAdornment?: boolean
  isMultiSubmit?: boolean
  onEnter?: (name: string, val: string) => void
}> = ({
  field,
  onEnter,
  loading,
  inputProps,
  InputProps,
  defaultValue = '',
  isAdornment = true,
  isMultiSubmit = true,
  ...props
}) => {
  const [val, setVal] = useState<string>(defaultValue as string)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (isEmpty(e.target.value)) {
      setVal(e.target.value)
    } else if (isMultiSubmit && /^[0-9.,]*$/.test(e.target.value)) {
      setVal(e.target.value)
    } else if (/^[0-9.]*$/.test(e.target.value)) {
      setVal(e.target.value)
    }
  }

  return (
    <TextField
      {...props}
      value={val}
      onChange={e => handleChange(e)}
      disabled={loading
        ? true
        : props.disabled
      }
      sx={{
        bgcolor: '#FFF',
        '& .Mui-disabled': {
          bgcolor: '#F8F8F8'
        }
      }}
      InputProps={{
        ...InputProps,
        startAdornment: isAdornment ? (
          <InputAdornment position='start' sx={{ p: 0 }}>
            {loading
              ? (
                <CircularProgress color='secondary' size={11} />
              )
              : (
                <Typography color='secondary'>฿</Typography>
              )
            }
          </InputAdornment>
        ) : null
      }}
      inputProps={{
        ...inputProps,
        onKeyUp: (e) => {
          if (e.key === 'Enter' && onEnter) {
            onEnter(field, val)
            setVal('')
          }
        }
      }}
    />
  )
}

export default InputCost
