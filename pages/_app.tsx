import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import '@progress/kendo-theme-material/dist/all.css'
import '@hm-css/globals.css'

import { FC, } from 'react'
import { AppProps } from 'next/app'
import { AppProvider } from '@hm-stores/app.context'

import Layout from '@hm-components/Layout'

const App: FC<AppProps> = ({ Component, pageProps }) => {
  const {
    breadcrumbs = [],
    _withMaster = {},
    ...props
  } = pageProps

  return (
    <AppProvider
      value={{
        budgets: _withMaster?.budgets || [],
        products: _withMaster?.products || []
      }}
    >
      <Layout breadcrumbs={breadcrumbs}>
        <Component {...props} />
      </Layout>
    </AppProvider>
  )
}

export default App
