import moment, { Moment } from 'moment'
import { FC, useState, useEffect } from 'react'
import {
  Box,
  Chip,
  Paper,
  Stack,
  Divider,
  Typography,
} from '@mui/material'
import { CreditCard } from '@mui/icons-material'

import DatePicker from '@hm-components/DatePicker/Mobile'

interface FormState {
  date: Moment | null
}

// ----------------------------------

const _initForm: FormState = {
  date: moment()
}

const Module: FC = () => {
  const [form, setForm] = useState<FormState>({ ..._initForm })
  
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
              inputProps={{ fullWidth: true }}
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
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CreditCard sx={{ mr: 1 }} />
              <Chip
                size='small'
                color='primary'
                sx={{ p: 1 }}
                label={
                  <Typography variant='caption'>
                    Citi report /&nbsp;
                    2 {form.date?.format('MMM')} - 2 {moment(form.date).add(1, 'month').format('MMM')} /&nbsp;
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
    </>
  )
}

export default Module