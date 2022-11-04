import { FC, ReactNode } from 'react'
import { Box, Container, Breadcrumbs, Typography, Link } from '@mui/material'
import NextLink from 'next/link'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import Header from './Header'

interface Props {
  children?: ReactNode
  breadcrumbs?: {
    text: string
    path?: string
  }[]
}

const Layout: FC<Props> = ({ children, breadcrumbs }) => {
  return (
    <Box sx={{
      height: '100vh',
      bgcolor: '#ECECEC'
    }}>
      <Header />
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