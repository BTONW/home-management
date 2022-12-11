import NextLink from 'next/link'
import { FC, ElementType, ReactElement, useState } from 'react'
import { styled, ThemeProvider, createTheme } from '@mui/material/styles'
import {
  Box,
  Paper,
  Drawer,
  Divider,
  Tooltip,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from '@mui/material'
import {
  Close,
  Search,
  Cottage,
  DateRange,
  ArrowLeft,
  AttachMoney,
  KeyboardArrowDown
} from '@mui/icons-material'

interface Page {
  path: string
  icon?: ReactElement
  label: ReactElement
}

interface Props {
  open: boolean
  onNavigator: (val: boolean) => void
}

interface State {
  showCostofLiving: boolean
}

interface Menu {
  costOfLiving: Page[]
}

// ----------------------------------------

const _menu: Menu = {
  costOfLiving: [
    {
      icon: <AttachMoney color='warning' />,
      path: '/cost-of-living/report',
      label: (
        <>
          <Typography variant='overline'>report </Typography>
          <Typography variant='caption'>by Date</Typography>
        </>
      ),
    },
    {
      icon: <Search color='success' />,
      path: '/cost-of-living/search',
      label: (
        <>
          <Typography variant='overline'>search </Typography>
          <Typography variant='caption'>by Month</Typography>
        </>
      ),
    },
    {
      icon: <DateRange color='disabled' />,
      path: '/cost-of-living/maintain',
      label: (
        <>
          <Typography variant='overline'>maintain </Typography>
          <Typography variant='caption'>by Week</Typography>
        </>
      ),
    },
  ]
}

const _state: State = {
  showCostofLiving: true
}

// ----------------------------------------

const FireNav = styled(List)<{ component?: ElementType }>({
  borderRadius: 0,
  '& .MuiListItemButton-root': {
    paddingLeft: 24,
    paddingRight: 24,
  },
  '& .MuiListItemIcon-root': {
    minWidth: 0,
    marginRight: 16,
  },
  '& .MuiSvgIcon-root': {
    fontSize: 20,
  },
})

const Navigator: FC<Props> = ({ open, onNavigator }) => {
  const [state, setState] = useState<State>({ ..._state })

  return (
    <Drawer
      open={open}
      anchor='left'
      onClose={() => onNavigator(false)}
    >
      <Box sx={{ display: 'flex', bgcolor: 'rgb(5, 30, 52)', height: '100%' }}>
        <ThemeProvider
          theme={createTheme({
            components: {
              MuiListItemButton: {
                defaultProps: {
                  disableTouchRipple: true,
                },
              },
            },
            palette: {
              mode: 'dark',
              primary: { main: 'rgb(102, 157, 246)' },
              background: { paper: 'rgb(5, 30, 52)' },
            },
          })}
        >
          <Paper elevation={0} sx={{ width: '100%', borderRadius: 0 }}>
            <FireNav component='nav' disablePadding>
              <ListItem component='div' disablePadding sx={{ height: { xs: 55, md: 62 } }}>
                <NextLink href='/'>
                  <ListItemButton
                    sx={{ height: 56 }}
                    onClick={() => onNavigator(false)}
                  >
                    <ListItemIcon sx={{ marginTop: -0.6 }}>
                      <Cottage color='primary' />
                    </ListItemIcon>
                    <ListItemText
                      primary='ome Management'
                      primaryTypographyProps={{
                        color: 'primary',
                        variant: 'body2',
                        fontWeight: 'medium',
                      }}
                    />
                  </ListItemButton>
                </NextLink>
                <Tooltip title='Close Navigate'>
                  <IconButton
                    size='large'
                    onClick={() => onNavigator(false)}
                    sx={{
                      '& svg': {
                        transition: '0.4s',
                        transformStyle: 'preserve-3d',
                        color: 'rgba(255,255,255,0.8)',
                        transform: 'translateX(0) rotate(0)',
                      },
                      '&:hover, &:focus': {
                        bgcolor: 'unset',
                        '& svg:first-of-type': {
                          transform: 'translateX(-4px) rotateY(180deg)',
                        },
                        '& svg:last-of-type': {
                          right: 0,
                          opacity: 1,
                        },
                      },
                      '&:after': {
                        left: 0,
                        width: 1,
                        content: '""',
                        height: '80%',
                        display: 'block',
                        bgcolor: 'divider',
                        position: 'absolute',
                      },
                    }}
                  >
                    <Close />
                    <ArrowLeft sx={{ position: 'absolute', right: 4, opacity: 0 }} />
                  </IconButton>
                </Tooltip>
              </ListItem>
              <Divider />
              <Box
                sx={{
                  bgcolor: state.showCostofLiving
                    ? 'rgba(71, 98, 130, 0.2)'
                    : null,
                  pb: state.showCostofLiving
                    ? 2
                    : 0,
                }}
              >
                <ListItemButton
                  alignItems='flex-start'
                  onClick={() => setState({ ...state, showCostofLiving: !state.showCostofLiving })}
                  sx={{
                    px: 3,
                    pt: 2.5,
                    pb: state.showCostofLiving
                      ? 0
                      : 2.5,
                    '&:hover, &:focus': {
                      '& svg': { 
                        opacity: state.showCostofLiving
                          ? 1
                          : 0
                      }
                    },
                  }}
                >
                  <ListItemText
                    primary='Cost of Living'
                    primaryTypographyProps={{
                      mb: '2px',
                      fontSize: 15,
                      lineHeight: '20px',
                      fontWeight: 'medium',
                    }}
                    secondary='Search, Maintain, Report'
                    secondaryTypographyProps={{
                      noWrap: true,
                      fontSize: 12,
                      lineHeight: '16px',
                      color: state.showCostofLiving
                        ? 'rgba(0, 0, 0, 0)'
                        : 'rgba(255, 255, 255, 0.5)',
                    }}
                    sx={{ my: 0 }}
                  />
                  <KeyboardArrowDown
                    sx={{
                      mr: -1,
                      opacity: 0,
                      transform: state.showCostofLiving
                        ? 'rotate(-180deg)'
                        : 'rotate(0)',
                      transition: '0.2s',
                    }}
                  />
                </ListItemButton>
                {state.showCostofLiving &&
                  _menu.costOfLiving.map((item) => (
                    <NextLink key={item.path} href={item.path}>
                      <ListItemButton
                        onClick={() => onNavigator(false)}
                        sx={{ 
                          py: 0,
                          minHeight: 32,
                          color: 'rgba(255, 255, 255, .8)'
                        }}
                      >
                        <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
                        <ListItemText
                          primary={item.label}
                          primaryTypographyProps={{ fontSize: 14, fontWeight: 'medium' }}
                        />
                      </ListItemButton>
                    </NextLink>
                  ))
                }
              </Box>
            </FireNav>
          </Paper>
        </ThemeProvider>
      </Box>
    </Drawer>
  )
}

export default Navigator
