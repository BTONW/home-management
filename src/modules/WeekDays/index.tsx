import { FC, useState, useEffect } from 'react'
import { Grid, Stack, Paper, Divider } from '@mui/material'
import moment, { Moment } from 'moment'
import { DataGridColumn } from '@hm-dto/components.dto'
import DataGrid from '@hm-components/DataGrid'
import DatePicker from '@hm-components/DatePicker/Mobile'

interface FormState {
  date: Moment | null
}

const _initForm: FormState = {
  date: moment()
}

const Weekdays: FC = (props) => {
  const [form, setForm] = useState({ ..._initForm })

  const children: DataGridColumn[] = [
    {
      show: true,
      width: 150,
      field: 'Date',
      headerClassName: 'grid-head-center',
      title: 'Date'
    },
    {
      show: true,
      width: 150,
      field: 'Product',
      headerClassName: 'grid-head-center',
      title: 'Product'
    },
    {
      show: true,
      width: 150,
      field: 'Price',
      headerClassName: 'grid-head-center',
      title: 'Price'
    },
  ]

  const columns: DataGridColumn[] = [
    {
      show: true,
      field: 'Monday',
      title: 'Monday',
      headerClassName: 'grid-head-center',
      children
    },
    {
      show: true,
      field: 'Tuesday',
      title: 'Tuesday',
      headerClassName: 'grid-head-center',
      children
    },
    {
      show: true,
      field: 'Wednesday',
      title: 'Wednesday',
      headerClassName: 'grid-head-center',
      children
    },
    {
      show: true,
      field: 'Thursday',
      title: 'Thursday',
      headerClassName: 'grid-head-center',
      children
    },
    {
      show: true,
      field: 'Friday',
      title: 'Friday',
      headerClassName: 'grid-head-center',
      children
    },
  ]

  return (
    <>
      <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <Stack
          spacing={2}
          direction='row'
          divider={<Divider orientation='vertical' flexItem />}
        >
          <Paper elevation={0} sx={{ width: '23%' }}>
            <DatePicker
              disabled
              value={form.date}
              onChange={date => setForm({ ...form, date })}
              inputProps={{
                fullWidth: true
              }}
            />
          </Paper>
          <Paper elevation={0} sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                Grab
              </Grid>
              <Grid item xs={12} md={3}>
                7-Eleven
              </Grid>
            </Grid>
          </Paper>
        </Stack>
      </Paper>
      <Paper elevation={2} sx={{ overflow: 'auto' }}>
        <DataGrid
          rows={[]}
          columns={columns}
        />
      </Paper>
    </>
  )
}

export default Weekdays