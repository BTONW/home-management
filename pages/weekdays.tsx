import { FC } from 'react'
import { productService } from '@hm-services/service'
import Module from '@hm-modules/WeekDays'

const Page: FC = props => {
  return <Module {...props} />
}

export const getStaticProps = async () => {
  const resProduct = await productService.getProducts()
  return {
    props: {
      breadcrumbs: [
        { text: 'Home', path: '/' },
        { text: 'Weekdays' }
      ],
      resProduct
    }
  }
}

export default Page