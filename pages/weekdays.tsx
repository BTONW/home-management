import { FC } from 'react'

import { productService } from '@hm-services/service'

import { BodyProducts } from '@hm-dto/services.dto'
import { BreadCrumbs as BreadCrumbsDto } from '@hm-dto/components.dto'

import Module from '@hm-modules/WeekDays'

interface Props {
  resProduct: BodyProducts[]
  breadcrumbs: BreadCrumbsDto[]
}

const Page: FC<Props> = ({ resProduct }) => (
  <Module products={resProduct} />
)

export const getStaticProps = async () => {
  const { body } = await productService.getProducts()
  return {
    props: {
      breadcrumbs: [
        { text: 'Home', path: '/' },
        { text: 'Weekdays' }
      ],
      resProduct: body
    }
  }
}

export default Page