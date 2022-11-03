import { FC, ReactNode } from 'react'
import { Container } from '@mui/material'
import Header from './Header'

interface Props {
  children?: ReactNode
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <>
      <Header />
      <Container
        maxWidth='lg'
        sx={{ py: 3 }}
      >{children}</Container>
    </>
  )
}

export default Layout