import { FC, ReactElement, useState } from 'react'
import {
  Box,
  Drawer,
  AppBar,
  Divider,
  Toolbar,
  Container,
  IconButton,
  Typography,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from '@mui/material'
import NextLink from 'next/link'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import CottageIcon from '@mui/icons-material/Cottage'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'

interface Pages {
  icon?: ReactElement
  path: string
  primary: string
  secondary?: string
}

const pages: Pages[] = [
  {
    icon: <AttachMoneyIcon color='success' />,
    path: '/cost-of-living',
    primary: 'Cost of Living',
    secondary: 'cost credit & cash'
  },
  {
    icon: <AttachMoneyIcon color='success' />,
    path: '/weekends',
    primary: 'Weekends',
    secondary: 'budget weekends'
  },
  {
    icon: <CreditCardIcon color='warning' />,
    path: '/credit-card',
    primary: 'Credit-Card',
    secondary: '0%, etc..'
  }
]

const LayoutHeader: FC = () => {
  const [isDrawer, setIsDrawer] = useState(false)

  const handleCloseMenu = () => setIsDrawer(false)

  return (
    <>
      <Drawer
        anchor='left'
        open={isDrawer}
        onClose={handleCloseMenu}
      >
        <Box sx={{
          width: 220,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <IconButton
            size='large'
            color='primary'
            onClick={handleCloseMenu}
            sx={{ borderRadius: 0, height: { xs: 55, md: 62 } }}
          >
            <CloseIcon />
          </IconButton>
          <Divider />
          <List>
            {
              pages.map((page) => (
                <NextLink
                  href={page.path}
                  key={page.primary}
                  onClick={handleCloseMenu}
                >
                  <ListItemButton >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {page.icon}
                    </ListItemIcon>
                      <ListItemText
                        primary={page.primary}
                        secondary={page.secondary}
                      />
                  </ListItemButton>
                </NextLink>
              ))
            }
          </List>
        </Box>
      </Drawer>
      <AppBar position='sticky'>
        <Container maxWidth='xl'>
          <Toolbar
            disableGutters
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: { xs: 'space-between', md: 'inherit' }
            }}
          >
            <IconButton
              onClick={() => setIsDrawer(true)}
              sx={{ mr: 2, p: 0, color: 'inherit' }}
            >
              <MenuIcon />
            </IconButton>
            <NextLink href='/'>
              <Typography
                noWrap
                variant='h6'
                sx={{
                  mr: 2,
                  fontWeight: 700,
                  display: 'flex',
                  color: 'inherit',
                  alignItems: 'center',
                  textDecoration: 'none',
                  letterSpacing: '.3rem',
                  fontFamily: 'monospace'
                }}
              >
                <CottageIcon sx={{ marginTop: -0.7, marginRight: 1 }} /> OME MANAGEMENT
              </Typography>
            </NextLink>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  )
}

export default LayoutHeader
