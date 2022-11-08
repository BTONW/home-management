import dynamic from 'next/dynamic'
import moment, { Moment } from 'moment'
import { isNull } from 'lodash'
import { FC, useState, useEffect } from 'react'
import {
  Grid,
  Stack,
  Paper,
  Divider,
  TextField,
  Autocomplete,
  Box,
  List,
  ListItem,
  ListSubheader,
} from '@mui/material'

import { BitStatus, BudgetCode } from '@hm-dto/utils.dto'
import { BodyProducts, BodyBudgets } from '@hm-dto/services.dto'
import { DataGridColumn } from '@hm-dto/components.dto'

import InputCost from '@hm-components/InputCost'
import DatePicker from '@hm-components/DatePicker/Mobile'

const DataGrid = dynamic(() => import('@hm-components/DataGrid'), { ssr: false })

// -----------------------

interface ListColumn {
  Mon?: DataGridColumn[]
  Tue?: DataGridColumn[]
  Wed?: DataGridColumn[]
  Thu?: DataGridColumn[]
  Fri?: DataGridColumn[]
  Sat?: DataGridColumn[]
  Sun?: DataGridColumn[]
}

interface ListRow {
  Mon?: any[]
  Tue?: any[]
  Wed?: any[]
  Thu?: any[]
  Fri?: any[]
  Sat?: any[]
  Sun?: any[]
}

interface FormState {
  date: Moment | null
  productGrabId: number | null
  productOtherId: number | null
  product7ElevenId: number | null

  isLoadingGrab: boolean
  isLoadingOther: boolean
  isLoading7Eleven: boolean
}

interface Props {
  budgets: BodyBudgets[]
  products: BodyProducts[]
}

// -----------------------

const _initForm: FormState = {
  date: moment(),
  productGrabId: 3,
  productOtherId: null,
  product7ElevenId: 2,

  isLoadingGrab: false,
  isLoadingOther: false,
  isLoading7Eleven: false
}

const Weekdays: FC<Props> = ({ budgets, products }) => {
  const [form, setForm] = useState({ ..._initForm })
  const [rows, setRows] = useState<ListRow>({})
  const [columns, setColumns] = useState<ListColumn>({})

  const children: DataGridColumn[] = [
    {
      show: true,
      field: 'Product',
      className: 'text-center',
      headerClassName: 'grid-head-center',
      title: 'Product'
    },
    {
      show: true,
      field: 'Price',
      format: '{0:n}',
      className: 'text-right',
      headerClassName: 'grid-head-center',
      title: 'Price'
    },
  ]

  // handerler -------------------------

  const handleSetRows = (): ListRow => {
    return {
      [BudgetCode.MON]: [
        {
          Product: 'Budget',
          Price: budgets.find(budget => budget.code === BudgetCode.MON)?.budget_amount || 0
        }
      ],
      [BudgetCode.TUE]: [
        {
          Product: 'Budget',
          Price: budgets.find(budget => budget.code === BudgetCode.TUE)?.budget_amount || 0
        }
      ],
      [BudgetCode.WED]: [
        {
          Product: 'Budget',
          Price: budgets.find(budget => budget.code === BudgetCode.WED)?.budget_amount || 0
        }
      ],
      [BudgetCode.THU]: [
        {
          Product: 'Budget',
          Price: budgets.find(budget => budget.code === BudgetCode.THU)?.budget_amount || 0
        }
      ],
      [BudgetCode.FRI]: [
        {
          Product: 'Budget',
          Price: budgets.find(budget => budget.code === BudgetCode.FRI)?.budget_amount || 0
        }
      ],
      [BudgetCode.SAT]: [
        {
          Product: 'Budget',
          Price: budgets.find(budget => budget.code === BudgetCode.SAT)?.budget_amount || 0
        }
      ],
      [BudgetCode.SUN]: [
        {
          Product: 'Budget',
          Price: budgets.find(budget => budget.code === BudgetCode.SUN)?.budget_amount || 0
        }
      ]
    }
  }

  const handleSetColumns = (): ListColumn => {
    const date = moment(form.date)
    const format = 'MMMM / dddd DD'

    switch (date?.format('ddd')) {
      case BudgetCode.MON:
        return {
          [BudgetCode.MON]: [{
            show: true,
            field: 'Monday',
            headerClassName: 'grid-head-center grid-head-active',
            title: moment(date).format(format),
            children
          }],
          [BudgetCode.TUE]: [{
            show: true,
            field: 'Tuesday',
            headerClassName: 'grid-head-center',
            title: moment(date).add(1, 'day').format(format),
            children
          }],
          [BudgetCode.WED]: [{
            show: true,
            field: 'Wednesday',
            headerClassName: 'grid-head-center',
            title: moment(date).add(2, 'day').format(format),
            children
          }],
          [BudgetCode.THU]: [{
            show: true,
            field: 'Thursday',
            headerClassName: 'grid-head-center',
            title: moment(date).add(3, 'day').format(format),
            children
          }],
          [BudgetCode.FRI]: [{
            show: true,
            field: 'Friday',
            headerClassName: 'grid-head-center',
            title: moment(date).add(4, 'day').format(format),
            children
          }]
        }
      case BudgetCode.TUE:
        return {
          [BudgetCode.MON]: [{
            show: true,
            field: 'Monday',
            headerClassName: 'grid-head-center',
            title: moment(date).subtract(1, 'day').format(format),
            children
          }],
          [BudgetCode.TUE]: [{
            show: true,
            field: 'Tuesday',
            headerClassName: 'grid-head-center grid-head-active',
            title: moment(date).format(format),
            children
          }],
          [BudgetCode.WED]: [{
            show: true,
            field: 'Wednesday',
            headerClassName: 'grid-head-center',
            title: moment(date).add(1, 'day').format(format),
            children
          }],
          [BudgetCode.THU]: [{
            show: true,
            field: 'Thursday',
            headerClassName: 'grid-head-center',
            title: moment(date).add(2, 'day').format(format),
            children
          }],
          [BudgetCode.FRI]: [{
            show: true,
            field: 'Friday',
            headerClassName: 'grid-head-center',
            title: moment(date).add(3, 'day').format(format),
            children
          }]
        }
      case BudgetCode.WED:
        return {
          [BudgetCode.MON]: [{
            show: true,
            field: 'Monday',
            headerClassName: 'grid-head-center',
            title: moment(date).subtract(2, 'day').format(format),
            children
          }],
          [BudgetCode.TUE]: [{
            show: true,
            field: 'Tuesday',
            headerClassName: 'grid-head-center',
            title: moment(date).subtract(1, 'day').format(format),
            children
          }],
          [BudgetCode.WED]: [{
            show: true,
            field: 'Wednesday',
            headerClassName: 'grid-head-center grid-head-active',
            title: moment(date).format(format),
            children
          }],
          [BudgetCode.THU]: [{
            show: true,
            field: 'Thursday',
            headerClassName: 'grid-head-center',
            title: moment(date).add(1, 'day').format(format),
            children
          }],
          [BudgetCode.FRI]: [{
            show: true,
            field: 'Friday',
            headerClassName: 'grid-head-center',
            title: moment(date).add(2, 'day').format(format),
            children
          }]
        }
      case BudgetCode.THU:
        return {
          [BudgetCode.MON]: [{
            show: true,
            field: 'Monday',
            headerClassName: 'grid-head-center',
            title: moment(date).subtract(3, 'day').format(format),
            children
          }],
          [BudgetCode.TUE]: [{
            show: true,
            field: 'Tuesday',
            headerClassName: 'grid-head-center',
            title: moment(date).subtract(2, 'day').format(format),
            children
          }],
          [BudgetCode.WED]: [{
            show: true,
            field: 'Wednesday',
            headerClassName: 'grid-head-center',
            title: moment(date).subtract(1, 'day').format(format),
            children
          }],
          [BudgetCode.THU]: [{
            show: true,
            field: 'Thursday',
            headerClassName: 'grid-head-center grid-head-active',
            title: moment(date).format(format),
            children
          }],
          [BudgetCode.FRI]: [{
            show: true,
            field: 'Friday',
            headerClassName: 'grid-head-center',
            title: moment(date).add(1, 'day').format(format),
            children
          }]
        }
      case BudgetCode.FRI:
        return {
          [BudgetCode.MON]: [{
            show: true,
            field: 'Monday',
            headerClassName: 'grid-head-center',
            title: moment(date).subtract(4, 'day').format(format),
            children
          }],
          [BudgetCode.TUE]: [{
            show: true,
            field: 'Tuesday',
            headerClassName: 'grid-head-center',
            title: moment(date).subtract(3, 'day').format(format),
            children
          }],
          [BudgetCode.WED]: [{
            show: true,
            field: 'Wednesday',
            headerClassName: 'grid-head-center',
            title: moment(date).subtract(2, 'day').format(format),
            children
          }],
          [BudgetCode.THU]: [{
            show: true,
            field: 'Thursday',
            headerClassName: 'grid-head-center',
            title: moment(date).subtract(1, 'day').format(format),
            children
          }],
          [BudgetCode.FRI]: [{
            show: true,
            field: 'Friday',
            headerClassName: 'grid-head-center grid-head-active',
            title: moment(date).format(format),
            children
          }]
        }
      case BudgetCode.SAT:
        return {
          [BudgetCode.SAT]: [{
            show: true,
            field: 'Saturday',
            headerClassName: 'grid-head-center grid-head-active',
            title: moment(date).format(format),
            children
          }],
          [BudgetCode.SUN]: [{
            show: true,
            field: 'Sunday',
            headerClassName: 'grid-head-center',
            title: moment(date).add(1, 'day').format(format),
            children
          }]
        }
      case BudgetCode.SUN:
        return {
          [BudgetCode.SAT]: [{
            show: true,
            field: 'Saturday',
            headerClassName: 'grid-head-center',
            title: moment(date).subtract(1, 'day').format(format),
            children
          }],
          [BudgetCode.SUN]: [{
            show: true,
            field: 'Sunday',
            headerClassName: 'grid-head-center grid-head-active',
            title: moment(date).format(format),
            children
          }]
        }
      default:
        return {}
    }
  }

  const handleSubmitCostValue = (field: string, value: string) => {
    const values = value.split(',').map(val => parseFloat(val))
    console.log(values)
  }

  useEffect(() => {
    setRows(handleSetRows())
    setColumns(handleSetColumns())
  }, [form.date])

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
              width: { xs: '100%', sm: '30%', md: '23%' }
            }}
          >
            <DatePicker
              value={form.date}
              maxDate={moment()}
              onChange={date => setForm({ ...form, date })}
              inputProps={{
                fullWidth: true
              }}
            />
          </Paper>
          <Paper
            elevation={0}
            sx={{
              flexGrow: 1,
              maxWidth: { xs: '100%', sm: 500 },
            }}
          >
            <List
              subheader={
                <ListSubheader component='div'>Product Items</ListSubheader>
              }
            >
              {
                products
                  .filter(product => product.is_regular === BitStatus.TRUE)
                  .map((product, index) => (
                    <ListItem
                      disableGutters
                      key={`${product.id}-${index}`}
                    >
                      <Grid container spacing={1} alignItems='center'>
                        <Grid item xs={6}>
                          <Box sx={{ pl: 2 }}>{product.name}</Box>
                        </Grid>
                        <Grid item xs={6}>
                          <InputCost
                            size='small'
                            field={product.id.toString()}
                            onEnter={handleSubmitCostValue}
                            loading={product.id === form.product7ElevenId
                              ? form.isLoading7Eleven
                              : form.isLoadingGrab
                            }
                          />
                        </Grid>
                      </Grid>
                    </ListItem>
                  ))
              }
              <ListItem disableGutters>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Autocomplete
                      disablePortal
                      sx={{ maxWidth: 170 }}
                      getOptionLabel={option => option.name}
                      value={products.find(product => form.productOtherId === product.id) || null}
                      renderInput={params => <TextField {...params} label='อื่น ๆ' size='small' />}
                      options={products.filter(product => product.is_regular === BitStatus.FALSE)}
                      onChange={(e, value) => setForm({ ...form, productOtherId: isNull(value) ? value : value.id })}
                      componentsProps={{
                        paper: {
                          sx: {
                            width: 220
                          }
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <InputCost
                      size='small'
                      loading={form.isLoadingOther}
                      onEnter={handleSubmitCostValue}
                      disabled={isNull(form.productOtherId)}
                      field={form.productOtherId?.toString() || ''}
                    />
                  </Grid>
                </Grid>
              </ListItem>
            </List>
          </Paper>
        </Stack>
      </Paper>

      <Paper elevation={2} sx={{ p: 2 }}>
        <Grid container spacing={2}>
          {
            Object.keys(columns).map(key => (
              <Grid key={key} item xs={12} sm={6} md={4} >
                <DataGrid
                  rows={rows[key as keyof ListColumn] as any[]}
                  columns={columns[key as keyof ListColumn] as DataGridColumn[]}
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