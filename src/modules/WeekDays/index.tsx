import { FC, useState } from 'react'
import { Grid, Paper } from '@mui/material'
import moment, { Moment } from 'moment'
import DatePicker from '@hm-components/DatePicker/Mobile'

interface FormState {
  date: Moment | null
}

const _initForm: FormState = {
  date: moment()
}

const Weekdays: FC = (props) => {
  const [form, setForm] = useState({ ..._initForm })
  return (
    <>
      <Paper elevation={2} sx={{ p: 2 }}>
        <DatePicker
          value={form.date}
          onChange={date => setForm({ ...form, date })}
          inputProps={{
            
          }}
        />
      </Paper>
    </>
  )
}

export default Weekdays