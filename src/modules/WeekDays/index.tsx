import dynamic from 'next/dynamic'
import moment, { Moment } from 'moment'
import { FC, useState } from 'react'
import { Grid, Stack, Paper, Divider } from '@mui/material'

import { BodyCostValues } from '@hm-dto/services.dto'
import { DataGridColumn } from '@hm-dto/components.dto'

import DatePicker from '@hm-components/DatePicker/Mobile'

const DataGrid = dynamic(() => import('@hm-components/DataGrid'), { ssr: false })

// -----------------------

interface ListColumn {
  Mon: DataGridColumn[]
  Tue: DataGridColumn[]
  Wed: DataGridColumn[]
  Thu: DataGridColumn[]
  Fri: DataGridColumn[]
}

interface FormState {
  date: Moment | null
}

interface Props {
  products: BodyCostValues[]
}

// -----------------------

const _initForm: FormState = {
  date: moment()
}

const Weekdays: FC<Props> = (props) => {
  const [form, setForm] = useState({ ..._initForm })

  const children: DataGridColumn[] = [
    {
      show: true,
      field: 'Date',
      headerClassName: 'grid-head-center',
      title: 'Date'
    },
    {
      show: true,
      field: 'Product',
      headerClassName: 'grid-head-center',
      title: 'Product'
    },
    {
      show: true,
      field: 'Price',
      headerClassName: 'grid-head-center',
      title: 'Price'
    },
  ]

  const columns: ListColumn = {
    Mon: [{
      show: true,
      field: 'Monday',
      title: 'Monday',
      headerClassName: 'grid-head-center',
      children
    }],
    Tue: [{
      show: true,
      field: 'Tuesday',
      title: 'Tuesday',
      headerClassName: 'grid-head-center',
      children
    }],
    Wed: [{
      show: true,
      field: 'Wednesday',
      title: 'Wednesday',
      headerClassName: 'grid-head-center',
      children
    }],
    Thu: [{
      show: true,
      field: 'Thursday',
      title: 'Thursday',
      headerClassName: 'grid-head-center',
      children
    }],
    Fri: [{
      show: true,
      field: 'Friday',
      title: 'Friday',
      headerClassName: 'grid-head-center',
      children
    }]
  }

  console.log(props)

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
              value={form.date}
              maxDate={moment()}
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
      <Paper elevation={2} sx={{ overflow: 'auto', p: 2 }}>
        <Grid container spacing={2}>
          {
            Object.keys(columns).map(key => (
              <Grid key={key} item xs={12} sm={6} md={4} >
                <DataGrid
                  rows={[]}
                  columns={columns[key as keyof ListColumn]}
                />
              </Grid>
            ))
          }
        </Grid>
      </Paper>
    </>
  )
}

export default Weekdays