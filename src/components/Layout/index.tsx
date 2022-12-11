import { FC, ReactNode, useState } from 'react'
import { Box, Container, Breadcrumbs, Typography, Link } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import NextLink from 'next/link'

import { BreadCrumbs as BreadCrumbsDto } from '@hm-dto/components.dto'

import Header from './Header'
import Navigator from './Navigator'

interface Props {
  children?: ReactNode
  breadcrumbs?: BreadCrumbsDto[]
}

const Layout: FC<Props> = ({ children, breadcrumbs }) => {
  const [isNavigator, setIsNavigator] = useState(false)

  const handleNavigator = (val: boolean) => setIsNavigator(val)

  return (
    <Box sx={{
      height: '100vh',
      bgcolor: '#ECECEC',
      overflow: 'auto'
    }}>
      <Navigator open={isNavigator} onNavigator={handleNavigator} />
      <Header onNavigator={handleNavigator} />
      <Container
        maxWidth='xl'
        sx={{ py: 3 }}
      >
        {breadcrumbs &&
          <Breadcrumbs
            sx={{ mb: 2 }}
            aria-label='breadcrumb'
            separator={<NavigateNextIcon fontSize='small' />}
          >
            {
              breadcrumbs?.map((item, index) => item.path
                ? (
                    <NextLink
                      passHref
                      href={item.path}
                      legacyBehavior
                      key={`${index}-${item.text}`}
                    >
                      <Link
                        underline='none'
                        sx={{ cursor: 'pointer' }}
                      >
                        {item.text}
                      </Link>
                    </NextLink>
                  )
                : (
                    <Typography key={`${index}-${item.text}`} color='GrayText'>
                      {item.text}
                    </Typography>
                  )
              )
            }
          </Breadcrumbs>
        }
        {children}
      </Container>
    </Box>
  )
}

export default Layout