import dynamic from 'next/dynamic'
import moment, { Moment } from 'moment'
import { isNull } from 'lodash'
import { FC, useState } from 'react'
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

import { BitStatus } from '@hm-dto/utils.dto'
import { BodyCostValues } from '@hm-dto/services.dto'
import { DataGridColumn } from '@hm-dto/components.dto'

import InputCost from '@hm-components/InputCost'
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
  productGrabId: number | null
  productOtherId: number | null
  product7ElevenId: number | null

  isLoadingGrab: boolean
  isLoadingOther: boolean
  isLoading7Eleven: boolean
}

interface Props {
  products: BodyCostValues[]
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

const Weekdays: FC<Props> = ({ products }) => {
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

  // handerler -------------------------

  const handleSubmitCostValue = (field: string, value: string) => {
    const values = value.split(',').map(val => parseFloat(val))
    console.log(values)
  }

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
                      value={products.find(product => form.productOtherId === product.id)}
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