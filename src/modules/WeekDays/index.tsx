import dynamic from 'next/dynamic'
import moment, { Moment } from 'moment'
import { isNull, isNaN } from 'lodash'
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

import { DataGridColumn } from '@hm-dto/components.dto'
import { BitStatus, BudgetCode, PaymentType } from '@hm-dto/utils.dto'
import { BodyProducts, BodyBudgets, BodyCostValues, BodyCreateCostValues } from '@hm-dto/services.dto'

import { costValueService } from '@hm-services/service'

import InputCost from '@hm-components/InputCost'
import DatePicker from '@hm-components/DatePicker/Mobile'
import { SnackAlert } from '@hm-components/Alert'
import { BackdropLoading } from '@hm-components/Loading'

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
  Mon: any[]
  Tue: any[]
  Wed: any[]
  Thu: any[]
  Fri: any[]
  Sat: any[]
  Sun: any[]
}

interface CriteriaSearch {
  dates: string[]
  payments: string[]
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

const _initRows: ListRow = {
  Mon: [],
  Tue: [],
  Wed: [],
  Thu: [],
  Fri: [],
  Sat: [],
  Sun: [],
}

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
  const [msgAlert, setMsgAlert] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [columns, setColumns] = useState<ListColumn>({})
  const [rows, setRows] = useState<ListRow>({ ..._initRows })
  const [lastFridayRows, setLastFridayRows] = useState<any[]>([])

  const children: DataGridColumn[] = [
    {
      show: true,
      field: 'Product',
      title: 'Product',
      headerClassName: 'grid-head-center',
    },
    {
      show: true,
      field: 'Price',
      title: 'Price',
      format: '{0:n2}',
      className: 'text-right',
      headerClassName: 'grid-head-center',
    },
  ]

  // handerler -------------------------

  const handleSetRows = (listRows: ListRow): ListRow => {
    const _rows: ListRow = { ..._initRows }
    
    // List Product & Total
    Object.keys(_rows).forEach((key) => {
      const rowKey = key as keyof ListRow

      _rows[rowKey] = [
        ...listRows[rowKey],
        {
          Product: 'Total',
          isTotal: true,
          Price: (listRows[rowKey]).reduce((value, row) => value + row.Price, 0)
        }
      ]
    })

    // Cost of Living
    Object.keys(_rows).forEach((key) => {
      const rowKey = key as keyof ListRow

      switch (rowKey) {
        case BudgetCode.SAT: {
          const costOfLiving = budgets.find(budget => budget.code === rowKey)?.budget_amount || 0
          const total = _rows[rowKey].find(row => row.isTotal).Price || 0
          _rows[rowKey] = [
            {
              Product: 'Cost of living',
              Price: costOfLiving
            },
            ..._rows[rowKey],
            {
              Product: 'Balance',
              isBalance: true,
              Price: costOfLiving - total,
            },
          ]
          break
        }
        case BudgetCode.SUN: {
          const costOfLiving = budgets.find(budget => budget.code === rowKey)?.budget_amount || 0
          const total = _rows[rowKey].find(row => row.isTotal).Price || 0
          const yesterdayCostOfLiving = budgets.find(budget => budget.code === BudgetCode.SAT)?.budget_amount || 0
          const yesterdayTotal = _rows[BudgetCode.SAT].find(row => row.isTotal).Price || 0
          const yesterdayBalance = yesterdayCostOfLiving - yesterdayTotal
          _rows[rowKey] = [
            {
              Product: 'Cost of living',
              Price: costOfLiving + yesterdayBalance
            },
            ..._rows[rowKey],
            {
              Product: 'Balance',
              Price: (costOfLiving + yesterdayBalance) - total
            },
          ]
          break
        }
      }

      
    })

    return _rows
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

  const handleSetCriteria = (): CriteriaSearch => {
    const date = moment(form.date)
    const format = 'YYYY-MM-DD'
    const criteria: CriteriaSearch = {
      dates: [],
      payments: ['Credit']
    }

    switch (date?.format('ddd')) {
      case BudgetCode.MON:
        criteria.dates = [
          moment(date).subtract(3, 'day').format(format),
          moment(date).format(format),
          moment(date).add(1, 'day').format(format),
          moment(date).add(2, 'day').format(format),
          moment(date).add(3, 'day').format(format),
          moment(date).add(4, 'day').format(format),
        ]
        break
      case BudgetCode.TUE:
        criteria.dates = [
          moment(date).subtract(4, 'day').format(format),
          moment(date).subtract(1, 'day').format(format),
          moment(date).format(format),
          moment(date).add(1, 'day').format(format),
          moment(date).add(2, 'day').format(format),
          moment(date).add(3, 'day').format(format),
        ]
        break
      case BudgetCode.WED:
        criteria.dates = [
          moment(date).subtract(5, 'day').format(format),
          moment(date).subtract(2, 'day').format(format),
          moment(date).subtract(1, 'day').format(format),
          moment(date).format(format),
          moment(date).add(1, 'day').format(format),
          moment(date).add(2, 'day').format(format),
        ]
        break
      case BudgetCode.THU:
        criteria.dates = [
          moment(date).subtract(6, 'day').format(format),
          moment(date).subtract(3, 'day').format(format),
          moment(date).subtract(2, 'day').format(format),
          moment(date).subtract(1, 'day').format(format),
          moment(date).format(format),
          moment(date).add(1, 'day').format(format),
        ]
        break
      case BudgetCode.FRI:
        criteria.dates = [
          moment(date).subtract(7, 'day').format(format),
          moment(date).subtract(4, 'day').format(format),
          moment(date).subtract(3, 'day').format(format),
          moment(date).subtract(2, 'day').format(format),
          moment(date).subtract(1, 'day').format(format),
          moment(date).format(format),
        ]
        break
      case BudgetCode.SAT:
        criteria.dates = [
          moment(date).format(format),
          moment(date).add(1, 'day').format(format),
        ]
        break
      case BudgetCode.SUN:
        criteria.dates = [
          moment(date).subtract(1, 'day').format(format),
          moment(date).format(format),
        ]
        break
    }

    return criteria
  }

  const handleSetCriteriaLastFriday = (): CriteriaSearch => {
    const date = moment(form.date)
    const format = 'YYYY-MM-DD'
    const criteria: CriteriaSearch = {
      dates: [],
      payments: ['Credit']
    }

    switch (date?.format('ddd')) {
      case BudgetCode.MON:
        criteria.dates = [
          moment(date).subtract(3, 'day').format(format),
        ]
        break
      case BudgetCode.TUE:
        criteria.dates = [
          moment(date).subtract(4, 'day').format(format),
        ]
        break
      case BudgetCode.WED:
        criteria.dates = [
          moment(date).subtract(5, 'day').format(format),
        ]
        break
      case BudgetCode.THU:
        criteria.dates = [
          moment(date).subtract(6, 'day').format(format),
        ]
        break
      case BudgetCode.FRI:
        criteria.dates = [
          moment(date).subtract(7, 'day').format(format),
        ]
        break
      case BudgetCode.SAT:
        criteria.dates = [
          moment(date).subtract(1, 'day').format(format),
        ]
        break
      case BudgetCode.SUN:
        criteria.dates = [
          moment(date).subtract(2, 'day').format(format),
        ]
        break
    }

    return criteria
  }

  const handleSearchCostValue = async () => {
    setIsLoading(true)
    try {
      const [
        { body: bodyDays },
        { body: bodyDay },
      ] = await Promise.all([
        costValueService.getCostValuesByDays<ListRow>({
          params: handleSetCriteria()
        }),
        costValueService.getCostValues<any[]>({
          params: handleSetCriteriaLastFriday()
        })
      ])
      setRows(handleSetRows(bodyDays))
      setLastFridayRows(bodyDay)
    } catch (err) {
      setRows({ ..._initRows })
      setLastFridayRows([])
    }
    setColumns(handleSetColumns())
    setIsLoading(false)
  }

  const handleSubmitCostValue = async (field: string, value: string) => {
    if (!field) {
      setMsgAlert('Error, with product !!')
      return
    }
    if (isNull(form.date)) {
      setMsgAlert('Error, date is undefined !!')
      return
    }

    const values = value.split(',').map(val => parseFloat(val)).filter(val => !isNaN(val))
    if (!values.length) {
      setMsgAlert('Error, values is empty !!')
      return
    }

    const productId = parseFloat(field)
    const params: BodyCreateCostValues[] = values.map(value => ({
      payment: PaymentType.CREDIT,
      cost_amount: value,
      product_id: productId,
      date: form.date?.format('YYYY-MM-DD') as string
    }))

    setIsLoading(true)
    try {
      const { success } = await costValueService.createCostValues<BodyCostValues, BodyCreateCostValues[]>(params)
      if (success) {
        handleSearchCostValue()
      } else {
        setIsLoading(false)
      }
    } catch (err) {
      console.log(err)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    handleSearchCostValue()
  }, [form.date])

  return (
    <>
      <BackdropLoading loading={isLoading} />

      <SnackAlert
        severity='error'
        message={msgAlert}
        open={msgAlert !== ''}
        onClose={() => setMsgAlert('')}
      />

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