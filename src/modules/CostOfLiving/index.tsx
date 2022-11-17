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
  Chip,
  List,
  ListItem,
  ListSubheader,
} from '@mui/material'

import { DataGridColumn } from '@hm-dto/components.dto'
import { BitStatus, BudgetCode, PaymentType } from '@hm-dto/utils.dto'
import {
  BodyBalance,
  BodyBudgets,
  BodyProducts,
  BodyCostValues,
  BodyCreateCostValues,
  BodyUpdateCostValues
} from '@hm-dto/services.dto'

import { costValueService, balanceService } from '@hm-services/service'

import InputCost from '@hm-components/InputCost'
import DatePicker from '@hm-components/DatePicker/Mobile'
import { SnackAlert } from '@hm-components/Alert'
import { BackdropLoading } from '@hm-components/Loading'

import { SubmitOption } from './DataGrid'
const DataGrid = dynamic(() => import('./DataGrid'), { ssr: false })

// -----------------------

interface Column {
  date: string
  columns: DataGridColumn[]
}
interface ListColumn {
  Mon?: Column
  Tue?: Column
  Wed?: Column
  Thu?: Column
  Fri?: Column
  Sat?: Column
  Sun?: Column
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

interface DiffDayCode {
  Mon: BudgetCode
  Tue: BudgetCode
  Wed: BudgetCode
  Thu: BudgetCode
  Fri: BudgetCode
  Sun: BudgetCode
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

const _diffDayCode: DiffDayCode = {
  Mon: BudgetCode.FRI,
  Tue: BudgetCode.MON,
  Wed: BudgetCode.TUE,
  Thu: BudgetCode.WED,
  Fri: BudgetCode.THU,
  Sun: BudgetCode.SAT
}

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

const CostOfLiving: FC<Props> = ({ budgets, products }) => {
  const [form, setForm] = useState({ ..._initForm })
  const [msgAlert, setMsgAlert] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [columns, setColumns] = useState<ListColumn>({})
  const [rows, setRows] = useState<ListRow>({ ..._initRows })
  const [costValues, setCostValues] = useState<ListRow>({ ..._initRows })
  const [lastFridayBalance, setLastFridayBalance] = useState<BodyBalance | null>(null)
  const [fridayDate, setFridayDate] = useState('')
  const [fridayBalance, setFridayBalance] = useState<number | null>(null)

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

  const handleSetRows = (): ListRow => {
    const _rows: ListRow = { ..._initRows }
    
    // List Product & Total
    Object.keys(_rows).forEach((key) => {
      const rowKey = key as keyof ListRow
      _rows[rowKey] = [
        ...costValues[rowKey],
        {
          Product: 'Total',
          isTotal: true,
          Price: (costValues[rowKey]).reduce((value, row) => value + row.Price, 0)
        }
      ]
    })

    // Cost of Living & Balance
    Object.keys(_rows).forEach((key) => {
      const rowKey = key as keyof ListRow
      switch (rowKey) {
        case BudgetCode.MON: {
          const total = _rows[rowKey].find(row => row.isTotal)?.Price || 0
          const budget = budgets.find(budget => budget.code === rowKey)?.budget_amount || 0
          const costOfLiving = !isNull(lastFridayBalance) && lastFridayBalance?.balance_amount < 0
            ? budget + lastFridayBalance?.balance_amount
            : budget
          _rows[rowKey] = [
            {
              Product: 'Cost of living',
              isCostOfLiving: true,
              Price: costOfLiving
            },
            ..._rows[rowKey],
            {
              Product: 'Balance',
              isBalance: true,
              Price: costOfLiving - total
            },
          ]
          break
        }
        case BudgetCode.TUE:
        case BudgetCode.WED:
        case BudgetCode.THU:
        case BudgetCode.FRI:
        case BudgetCode.SUN: {
          const total = _rows[rowKey].find(row => row.isTotal).Price || 0
          const budget = budgets.find(budget => budget.code === rowKey)?.budget_amount || 0
          const diffDayBalance = _rows[_diffDayCode[rowKey]].find(row => row.isBalance)?.Price || 0
          
          const costOfLiving = rowKey === BudgetCode.SUN
            ? budget + diffDayBalance
            : diffDayBalance < 0
              ? budget + diffDayBalance
              : budget
          
          const balance = costOfLiving - total
          if (rowKey === BudgetCode.FRI) {
            setFridayBalance(balance)
          }

          _rows[rowKey] = [
            {
              Product: 'Cost of living',
              isCostOfLiving: true,
              Price: costOfLiving
            },
            ..._rows[rowKey],
            {
              Product: 'Balance',
              isBalance: true,
              Price: balance
            },
          ]
          break
        }
        case BudgetCode.SAT: {
          const costOfLiving = budgets.find(budget => budget.code === rowKey)?.budget_amount || 0
          const total = _rows[rowKey].find(row => row.isTotal).Price || 0
          _rows[rowKey] = [
            {
              Product: 'Cost of living',
              isCostOfLiving: true,
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
      }
    })
    
    return _rows
  }

  const handleSetColumns = (): ListColumn => {
    const date = moment(form.date)
    const formatDate = 'YYYY-MM-DD'
    const formatTitle = 'MMMM / dddd DD'

    switch (date?.format('ddd')) {
      case BudgetCode.MON:
        setFridayDate(moment(date).add(4, 'day').format(formatDate))
        return {
          [BudgetCode.MON]: {
            date: moment(date).format(formatDate),
            columns: [{
              show: true,
              field: 'Monday',
              headerClassName: 'grid-head-center grid-head-active',
              title: moment(date).format(formatTitle),
              children
            }]
          },
          [BudgetCode.TUE]: {
            date: moment(date).add(1, 'day').format(formatDate),
            columns: [{
              show: true,
              field: 'Tuesday',
              headerClassName: 'grid-head-center',
              title: moment(date).add(1, 'day').format(formatTitle),
              children
            }]
          },
          [BudgetCode.WED]: {
            date: moment(date).add(2, 'day').format(formatDate),
            columns: [{
              show: true,
              field: 'Wednesday',
              headerClassName: 'grid-head-center',
              title: moment(date).add(2, 'day').format(formatTitle),
              children
            }]
          },
          [BudgetCode.THU]: {
            date: moment(date).add(3, 'day').format(formatDate),
            columns: [{
              show: true,
              field: 'Thursday',
              headerClassName: 'grid-head-center',
              title: moment(date).add(3, 'day').format(formatTitle),
              children
            }]
          },
          [BudgetCode.FRI]: {
            date: moment(date).add(4, 'day').format(formatDate),
            columns: [{
              show: true,
              field: 'Friday',
              headerClassName: 'grid-head-center',
              title: moment(date).add(4, 'day').format(formatTitle),
              children
            }]
          }
        }
      case BudgetCode.TUE:
        setFridayDate(moment(date).add(3, 'day').format(formatDate))
        return {
          [BudgetCode.MON]: {
            date: moment(date).subtract(1, 'day').format(formatDate),
            columns: [{
              show: true,
              field: 'Monday',
              headerClassName: 'grid-head-center',
              title: moment(date).subtract(1, 'day').format(formatTitle),
              children
            }]
          },
          [BudgetCode.TUE]: {
            date: moment(date).format(formatDate),
            columns: [{
              show: true,
              field: 'Tuesday',
              headerClassName: 'grid-head-center grid-head-active',
              title: moment(date).format(formatTitle),
              children
            }]
          },
          [BudgetCode.WED]: {
            date: moment(date).add(1, 'day').format(formatDate),
            columns: [{
              show: true,
              field: 'Wednesday',
              headerClassName: 'grid-head-center',
              title: moment(date).add(1, 'day').format(formatTitle),
              children
            }]
          },
          [BudgetCode.THU]: {
            date: moment(date).add(2, 'day').format(formatDate),
            columns: [{
              show: true,
              field: 'Thursday',
              headerClassName: 'grid-head-center',
              title: moment(date).add(2, 'day').format(formatTitle),
              children
            }]
          },
          [BudgetCode.FRI]: {
            date: moment(date).add(3, 'day').format(formatDate),
            columns: [{
              show: true,
              field: 'Friday',
              headerClassName: 'grid-head-center',
              title: moment(date).add(3, 'day').format(formatTitle),
              children
            }]
          }
        }
      case BudgetCode.WED:
        setFridayDate(moment(date).add(2, 'day').format(formatDate))
        return {
          [BudgetCode.MON]: {
            date: moment(date).subtract(2, 'day').format(formatDate),
            columns: [{
              show: true,
              field: 'Monday',
              headerClassName: 'grid-head-center',
              title: moment(date).subtract(2, 'day').format(formatTitle),
              children
            }]
          },
          [BudgetCode.TUE]: {
            date: moment(date).subtract(1, 'day').format(formatDate),
            columns: [{
              show: true,
              field: 'Tuesday',
              headerClassName: 'grid-head-center',
              title: moment(date).subtract(1, 'day').format(formatTitle),
              children
            }]
          },
          [BudgetCode.WED]: {
            date: moment(date).format(formatDate),
            columns: [{
              show: true,
              field: 'Wednesday',
              headerClassName: 'grid-head-center grid-head-active',
              title: moment(date).format(formatTitle),
              children
            }]
          },
          [BudgetCode.THU]: {
            date: moment(date).add(1, 'day').format(formatDate),
            columns: [{
              show: true,
              field: 'Thursday',
              headerClassName: 'grid-head-center',
              title: moment(date).add(1, 'day').format(formatTitle),
              children
            }]
          },
          [BudgetCode.FRI]: {
            date: moment(date).add(2, 'day').format(formatDate),
            columns: [{
              show: true,
              field: 'Friday',
              headerClassName: 'grid-head-center',
              title: moment(date).add(2, 'day').format(formatTitle),
              children
            }]
          }
        }
      case BudgetCode.THU:
        setFridayDate(moment(date).add(1, 'day').format(formatDate))
        return {
          [BudgetCode.MON]: {
            date: moment(date).subtract(3, 'day').format(formatDate),
            columns: [{
              show: true,
              field: 'Monday',
              headerClassName: 'grid-head-center',
              title: moment(date).subtract(3, 'day').format(formatTitle),
              children
            }]
          },
          [BudgetCode.TUE]: {
            date: moment(date).subtract(2, 'day').format(formatDate),
            columns: [{
              show: true,
              field: 'Tuesday',
              headerClassName: 'grid-head-center',
              title: moment(date).subtract(2, 'day').format(formatTitle),
              children
            }]
          },
          [BudgetCode.WED]: {
            date: moment(date).subtract(1, 'day').format(formatDate),
            columns: [{
              show: true,
              field: 'Wednesday',
              headerClassName: 'grid-head-center',
              title: moment(date).subtract(1, 'day').format(formatTitle),
              children
            }]
          },
          [BudgetCode.THU]: {
            date: moment(date).format(formatDate),
            columns: [{
              show: true,
              field: 'Thursday',
              headerClassName: 'grid-head-center grid-head-active',
              title: moment(date).format(formatTitle),
              children
            }]
          },
          [BudgetCode.FRI]: {
            date: moment(date).add(1, 'day').format(formatDate),
            columns: [{
              show: true,
              field: 'Friday',
              headerClassName: 'grid-head-center',
              title: moment(date).add(1, 'day').format(formatTitle),
              children
            }]
          }
        }
      case BudgetCode.FRI:
        setFridayDate(moment(date).format(formatDate))
        return {
          [BudgetCode.MON]: {
            date: moment(date).subtract(4, 'day').format(formatDate),
            columns: [{
              show: true,
              field: 'Monday',
              headerClassName: 'grid-head-center',
              title: moment(date).subtract(4, 'day').format(formatTitle),
              children
            }]
          },
          [BudgetCode.TUE]: {
            date: moment(date).subtract(3, 'day').format(formatDate),
            columns: [{
              show: true,
              field: 'Tuesday',
              headerClassName: 'grid-head-center',
              title: moment(date).subtract(3, 'day').format(formatTitle),
              children
            }]
          },
          [BudgetCode.WED]: {
            date: moment(date).subtract(2, 'day').format(formatDate),
            columns: [{
              show: true,
              field: 'Wednesday',
              headerClassName: 'grid-head-center',
              title: moment(date).subtract(2, 'day').format(formatTitle),
              children
            }]
          },
          [BudgetCode.THU]: {
            date: moment(date).subtract(1, 'day').format(formatDate),
            columns: [{
              show: true,
              field: 'Thursday',
              headerClassName: 'grid-head-center',
              title: moment(date).subtract(1, 'day').format(formatTitle),
              children
            }]
          },
          [BudgetCode.FRI]: {
            date: moment(date).format(formatDate),
            columns: [{
              show: true,
              field: 'Friday',
              headerClassName: 'grid-head-center grid-head-active',
              title: moment(date).format(formatTitle),
              children
            }]
          }
        }
      case BudgetCode.SAT:
        setFridayDate('')
        return {
          [BudgetCode.SAT]: {
            date: moment(date).format(formatDate),
            columns: [{
              show: true,
              field: 'Saturday',
              headerClassName: 'grid-head-center grid-head-active',
              title: moment(date).format(formatTitle),
              children
            }]
          },
          [BudgetCode.SUN]: {
            date: moment(date).add(1, 'day').format(formatDate),
            columns: [{
              show: true,
              field: 'Sunday',
              headerClassName: 'grid-head-center',
              title: moment(date).add(1, 'day').format(formatTitle),
              children
            }]
          }
        }
      case BudgetCode.SUN:
        setFridayDate('')
        return {
          [BudgetCode.SAT]: {
            date: moment(date).subtract(1, 'day').format(formatDate),
            columns: [{
              show: true,
              field: 'Saturday',
              headerClassName: 'grid-head-center',
              title: moment(date).subtract(1, 'day').format(formatTitle),
              children
            }]
          },
          [BudgetCode.SUN]: {
            date:  moment(date).format(formatDate),
            columns: [{
              show: true,
              field: 'Sunday',
              headerClassName: 'grid-head-center grid-head-active',
              title: moment(date).format(formatTitle),
              children
            }]
          }
        }
      default:
        return {}
    }
  }

  const handleSetCriteria = (type: 'cost_value' | 'balance'): CriteriaSearch => {
    const date = moment(form.date)
    const format = 'YYYY-MM-DD'
    const criteria: CriteriaSearch = {
      dates: [],
      payments: ['Credit']
    }

    switch (date?.format('ddd')) {
      case BudgetCode.MON:
        criteria.dates = {
          cost_value: [
            moment(date).format(format),
            moment(date).add(1, 'day').format(format),
            moment(date).add(2, 'day').format(format),
            moment(date).add(3, 'day').format(format),
            moment(date).add(4, 'day').format(format),
          ],
          balance: [moment(date).subtract(3, 'day').format(format)]
        }[type]
        break
      case BudgetCode.TUE:
        criteria.dates = {
          cost_value: [
            moment(date).subtract(1, 'day').format(format),
            moment(date).format(format),
            moment(date).add(1, 'day').format(format),
            moment(date).add(2, 'day').format(format),
            moment(date).add(3, 'day').format(format),
          ],
          balance: [moment(date).subtract(4, 'day').format(format)]
        }[type]
        break
      case BudgetCode.WED:
        criteria.dates = {
          cost_value: [
            moment(date).subtract(2, 'day').format(format),
            moment(date).subtract(1, 'day').format(format),
            moment(date).format(format),
            moment(date).add(1, 'day').format(format),
            moment(date).add(2, 'day').format(format),
          ],
          balance: [moment(date).subtract(5, 'day').format(format)]
        }[type]
        break
      case BudgetCode.THU:
        criteria.dates = {
          cost_value: [
            moment(date).subtract(3, 'day').format(format),
            moment(date).subtract(2, 'day').format(format),
            moment(date).subtract(1, 'day').format(format),
            moment(date).format(format),
            moment(date).add(1, 'day').format(format),
          ],
          balance: [moment(date).subtract(6, 'day').format(format)]
        }[type]
        break
      case BudgetCode.FRI:
        criteria.dates = {
          cost_value: [
            moment(date).subtract(4, 'day').format(format),
            moment(date).subtract(3, 'day').format(format),
            moment(date).subtract(2, 'day').format(format),
            moment(date).subtract(1, 'day').format(format),
            moment(date).format(format),
          ],
          balance: [moment(date).subtract(7, 'day').format(format)]
        }[type]
        break
      case BudgetCode.SAT:
        criteria.dates = {
          cost_value: [
            moment(date).format(format),
            moment(date).add(1, 'day').format(format),
          ],
          balance: [moment(date).subtract(1, 'day').format(format)]
        }[type]
        break
      case BudgetCode.SUN:
        criteria.dates = {
          cost_value: [
            moment(date).subtract(1, 'day').format(format),
            moment(date).format(format),
          ],
          balance: [moment(date).subtract(2, 'day').format(format)]
        }[type]
        break
    }

    return criteria
  }

  const handleSearchCostValue = async () => {
    setIsLoading(true)
    try {
      const [
        { body: bodyCostValues },
        { body: bodyBalances },
      ] = await Promise.all([
        costValueService.getCostValuesByDays<ListRow>({
          params: handleSetCriteria('cost_value')
        }),
        balanceService.getBalance({
          params: handleSetCriteria('balance')
        })
      ])

      const [balance] = bodyBalances
      setLastFridayBalance(balance?.id
        ? balance
        : null
      )
      setCostValues(bodyCostValues)
    } catch (err) {
      setLastFridayBalance(null)
      setCostValues({ ..._initRows })
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

    if (productId === _initForm.productGrabId) {
      setForm({ ...form, isLoadingGrab: true })
    } else if (productId === _initForm.product7ElevenId) {
      setForm({ ...form, isLoading7Eleven: true })
    } else {
      setForm({ ...form, isLoadingOther: true })
    }
    try {
      const { success } = await costValueService.createCostValues<BodyCostValues, BodyCreateCostValues[]>(params)
      if (success) {
        handleSearchCostValue()
      } else {
        setMsgAlert('Error, save failed !!')
      }
    } catch (err) {
      console.log(err)
      setMsgAlert('Error, save failed !!')
    }
    if (productId === _initForm.productGrabId) {
      setForm({ ...form, isLoadingGrab: false })
    } else if (productId === _initForm.product7ElevenId) {
      setForm({ ...form, isLoading7Eleven: false })
    } else {
      setForm({ ...form, isLoadingOther: false })
    }
  }

  const handleSubmitGridCostValue = async (option: SubmitOption) => {
    if (!option.costValueId) {
      setMsgAlert('Error, with ID cost of value !!')
      return
    }
    if (isNull(option.date)) {
      setMsgAlert('Error, date for cost of value is undefined !!')
      return
    }
    if (isNaN(option.value)) {
      setMsgAlert('Error, values is Invalid !!')
      return
    }
    const params: BodyUpdateCostValues[] = [{
      date: option.date,
      cost_amount: option.value,
      cost_value_id: option.costValueId,
    }]
    try {
      const { success, body } = await costValueService.updateCostValues<any[], BodyUpdateCostValues[]>(params)
      if (success) {
        handleSearchCostValue()
      } else {
        setMsgAlert(`Error, ${body.join(', ')} !!`)
      }
    } catch (err) {
      setMsgAlert('Error, save failed !!')
    }
  }

  const handleSubmitBalance = async () => {
    if (fridayDate && !isNull(fridayBalance)) {
      try {
        await balanceService.upsertBalance({
          date: fridayDate,
          balance_amount: fridayBalance
        })
      } catch (err) {
        setMsgAlert('Error, save balance friday failed !!')
      }
    }
  }

  useEffect(() => {
    handleSearchCostValue()
  }, [form.date])

  useEffect(() => {
    const _rows = handleSetRows()
    setRows(_rows)
    setFridayBalance(_rows[BudgetCode.FRI]
      .find(item => item.isBalance)?.Price || null
    )
  }, [lastFridayBalance, costValues])

  useEffect(() => {
    handleSubmitBalance()
  }, [fridayBalance, fridayDate])

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
              width: { xs: '100%', sm: '30%', md: '23%' },
              display: 'flex',
              flexWrap: 'wrap',
              flexDirection: 'row',
              justifyContent: 'space-between'
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
            {![BudgetCode.SAT, BudgetCode.SUN].includes(form.date?.format('ddd') as BudgetCode) &&
             <Paper
              elevation={0}
              sx={{
                my: 2,
                display: 'inline-flex',
                alignItems: 'flex-end',
              }}
             >
                <Chip
                  color='info'
                  label={`Last Friday Balance : ${(
                    lastFridayBalance?.balance_amount || 0).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2
                    })
                  }`}
                />
             </Paper>
            }
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
                  onSubmit={handleSubmitGridCostValue}
                  rows={rows[key as keyof ListColumn] as any[]}
                  date={columns[key as keyof ListColumn]?.date as string}
                  columns={columns[key as keyof ListColumn]?.columns as DataGridColumn[]}
                />
              </Grid>
            ))
          }
        </Grid>
      </Paper>
    </>
  )
}

export default CostOfLiving