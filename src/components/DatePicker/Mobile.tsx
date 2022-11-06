import { FC } from 'react'
import { Moment } from 'moment'
import { TextField, TextFieldProps } from '@mui/material'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider, MobileDatePicker, MobileDatePickerProps, CalendarPickerView } from '@mui/x-date-pickers'

interface Props {
  label?: string
  disabled?: boolean
  inputFormat?: string
  value?: Moment | null
  maxDate?: Moment
  onChange?: (date: Moment | null) => void
  inputProps?: TextFieldProps
  views?: CalendarPickerView[]
}

const DatePicker: FC<Props> = ({
  onChange,
  maxDate,
  inputProps,
  value = null,
  label = 'Date Time',
  inputFormat = 'DD / MMM / YYYY',
  views = ['year', 'month', 'day'],
  disabled
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <MobileDatePicker
        value={value}
        label={label}
        views={views}
        maxDate={maxDate}
        disabled={disabled}
        onChange={date => {
          if (onChange) {
            onChange(date)
          }
        }}
        inputFormat={inputFormat}
        renderInput={(params) => <TextField {...params} {...inputProps} />}
      />
    </LocalizationProvider>
  )
}

export default DatePicker