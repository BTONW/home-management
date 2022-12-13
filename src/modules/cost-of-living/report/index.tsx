import dynamic from 'next/dynamic'
import moment, { Moment } from 'moment'
import { FC, useState, useEffect, useContext } from 'react'
import {
  Box,
  Chip,
  Grid,
  Paper,
  Stack,
  Divider,
  Typography,
} from '@mui/material'
import { CreditCard } from '@mui/icons-material'

import { getStackDays } from '@hm-utils/date'

import { costValueService } from '@hm-services/service'

import { DataGridColumn } from '@hm-dto/components.dto'
import { BudgetCode as DayCode } from '@hm-dto/utils.dto'

import AppContext from '@hm-stores/app.context'
import DatePicker from '@hm-components/DatePicker/Mobile'

const DataGrid = dynamic(() => import('./DataGrid'), { ssr: false })

interface GroupDays {
  type: 'weekday' | 'weekend'
  startAt: string
  endAt: string
  days: string[]
  total?: number
}

interface Row {
  Date: string
  Type: 'weekday' | 'weekend'
  Budget: number
  Total: number
  Balance: number
}

interface FormState {
  date: Moment | null
  groupDays: GroupDays[]
}

interface CriteriaSearch {
  groupDays: GroupDays[]
}

// ----------------------------------

const _initForm: FormState = {
  groupDays: [],
  date: moment(),
}

const _initDaysGroup: GroupDays = {
  type: 'weekday',
  startAt: '',
  endAt: '',
  days: [],
}

const Module: FC = () => {
  const { budgets, set } = useContext(AppContext)
  const [form, setForm] = useState<FormState>({ ..._initForm })
  const [rows, setRows] = useState<Row[]>([])

  const costOfLiving = {
    weekday: budgets
      .filter(budget => [
          DayCode.MON, DayCode.TUE,
          DayCode.WED, DayCode.THU, DayCode.FRI
        ].includes(budget.code)
      ).reduce((val, budget) => val + budget.budget_amount, 0),
    weekend: budgets
      .filter(budget => [
          DayCode.SAT, DayCode.SUN,
        ].includes(budget.code)
      ).reduce((val, budget) => val + budget.budget_amount, 0),
  }

  const columns: DataGridColumn[] = [
    {
      show: true,
      field: 'Date',
      title: 'Date',
      className: 'text-center',
      headerClassName: 'grid-head-center',
    },
    {
      show: true,
      field: 'Type',
      title: 'Type',
      className: 'text-center',
      headerClassName: 'grid-head-center',
    },
    {
      show: true,
      field: 'Budget',
      title: 'Cost of Living',
      className: 'text-center',
      headerClassName: 'grid-head-center',
    },
    {
      show: true,
      field: 'Total',
      title: 'Total',
      format: '{0:n2}',
      className: 'text-right',
      headerClassName: 'grid-head-center',
    },
    {
      show: true,
      field: 'Balance',
      title: 'Balance',
      format: '{0:n2}',
      className: 'text-right',
      headerClassName: 'grid-head-center',
    }
  ]

  // handerler -------------------------

  const handleSetGroupDays = () => {

    const groupDays: GroupDays[] = []

    const days = getStackDays(
      moment(`${form.date?.format('YYYY-MM')}-03`),
      moment(`${form.date?.clone().add(1, 'month')?.format('YYYY-MM')}-02`)
    )

    // console.log(days.map(d => d.format('DD-MM-YYYY')).join(', '))

    let obj: GroupDays = { ..._initDaysGroup } 
    days.forEach((day, idx) => {
      switch (day?.format('ddd')) {
        case DayCode.MON:
        case DayCode.SAT:
          if (idx === days.length - 1) {
            obj = {
              ..._initDaysGroup,
              type: day?.format('ddd') ===  DayCode.MON
                ? 'weekday'
                : 'weekend',
              days: [day?.format('YYYY-MM-DD')],
              startAt: day?.format('YYYY-MM-DD'),
              endAt: day?.format('YYYY-MM-DD'),
            }
            groupDays.push(obj)
          } else {
            obj = {
              ..._initDaysGroup,
              type: day?.format('ddd') ===  DayCode.MON
                ? 'weekday'
                : 'weekend',
              days: [day?.format('YYYY-MM-DD')],
              startAt: day?.format('YYYY-MM-DD'),
            }
          }
          break

        case DayCode.TUE:
        case DayCode.WED:
        case DayCode.THU:
          if (idx === 0) {
            obj = {
              ..._initDaysGroup,
              type: 'weekday',
              days: [day?.format('YYYY-MM-DD')],
              startAt: day?.format('YYYY-MM-DD')
            }
          } else {
            obj.days.push(day?.format('YYYY-MM-DD'))
          }
          break

        case DayCode.FRI:
        case DayCode.SUN:
          if (idx === 0) {
            obj = {
              ..._initDaysGroup,
              type: day?.format('ddd') ===  DayCode.FRI
                ? 'weekday'
                : 'weekend',
              days: [day?.format('YYYY-MM-DD')],
              startAt: day?.format('YYYY-MM-DD')
            }
          } else {
            obj.endAt = day?.format('YYYY-MM-DD')
            obj.days.push(day?.format('YYYY-MM-DD'))
            groupDays.push(obj)
          }
          break
      }
    })

    setForm({ ...form, groupDays })
  }

  const handleSearchReport = async () => {
    set('loading', true)
    try {
      const params: CriteriaSearch = { groupDays: form.groupDays }
      const { body } = await costValueService.getReportCostValues<GroupDays[]>({
        params: params
      })
      setRows(
        body.map(val => {
          return {
            Date: `${moment(val.startAt).format('DD ddd YYYY')} - ${moment(val.endAt).format('DD ddd YYYY')}`,
            Type: val.type,
            Total: val.total || 0,
            Budget: costOfLiving[val.type],
            Balance: costOfLiving[val.type] - (val.total || 0),
          }
        })
      )
    } catch (err) {
      console.log(err)
    }
    set('loading', false)
  }

  useEffect(() => {
    handleSetGroupDays()
  }, [form.date])

  useEffect(() => {
    if (form.groupDays.length) {
      handleSearchReport()
    }
  }, [form.groupDays])
  
  return (
    <>
      <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <Stack
          direction='row'
          sx={{ flexWrap: 'wrap' }}
          divider={
            <Divider
              flexItem
              orientation='vertical'
              sx={{
                mr: 2,
                display: { xs: 'none', sm: 'block' }
              }}
            />
          }
        >
          <Paper
            elevation={0}
            sx={{ 
              mb: { xs: 2, sm: 0 },
              mr: { xs: 0, sm: 2 },
              width: { xs: '100%', sm: '30%', md: '23%' },
              display: 'flex',
              flexWrap: 'wrap',
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <DatePicker
              value={form.date}
              inputFormat='MMM / YYYY'
              views={['month', 'year']}
              inputProps={{ fullWidth: true, size: 'small' }}
              onChange={date => setForm({ ...form, date })}
            />
          </Paper>
          <Paper
            elevation={0}
            sx={{
              flexGrow: 1,
              maxWidth: { xs: '100%', sm: 500 },
            }}
          >
            <Box
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                mt: 0.9
              }}
            >
              <CreditCard sx={{ mr: 1 }} />
              <Chip
                size='small'
                color='primary'
                sx={{ p: 1 }}
                label={
                  <Typography variant='caption'>
                    Citi report /&nbsp;
                    3 {form.date?.format('MMM')} - 2 {moment(form.date).add(1, 'month').format('MMM')} /&nbsp;
                    {form.date?.format('YYYY')} {form.date?.format('MMM') === 'Dec'
                      ? `- ${parseFloat(form.date?.format('YYYY')) + 1}`
                      : ''
                    }
                  </Typography>
                }
              />
            </Box>
          </Paper>
        </Stack>
      </Paper>

      <Paper elevation={2} sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <DataGrid
              rows={rows}
              columns={columns}
            />
          </Grid>
        </Grid>
      </Paper>
    </>
  )
}

export default Module