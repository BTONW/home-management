import { FC } from 'react'
import {
  AppBar,
  Toolbar,
  Container,
  IconButton,
  Typography
} from '@mui/material'
import NextLink from 'next/link'
import MenuIcon from '@mui/icons-material/Menu'
import CottageIcon from '@mui/icons-material/Cottage'

interface Props {
  onNavigator: (val: boolean) => void
}

const LayoutHeader: FC<Props> = ({ onNavigator }) => (
  <AppBar
    position='sticky'
    sx={{
      mode: 'dark',
      bgcolor: 'rgb(6, 40, 69)'
    }}
  >
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
          onClick={() => onNavigator(true)}
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
)

export default LayoutHeader
