import { FC, useState } from 'react'
import { Moment } from 'moment'
import { TextField, TextFieldProps } from '@mui/material'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider, MobileDatePicker, CalendarPickerView } from '@mui/x-date-pickers'

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
  disabled,
  inputProps,
  value = null,
  label = 'Date Time',
  inputFormat = 'DD / MMM / YYYY',
  views = ['year', 'month', 'day'],
}) => {
  const [date, setDate] = useState(value)

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <MobileDatePicker
        value={date}
        label={label}
        views={views}
        maxDate={maxDate}
        onChange={setDate}
        disabled={disabled}
        onAccept={() => {
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