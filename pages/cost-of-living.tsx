import { FC } from 'react'

import { productService, masterService } from '@hm-services/service'

import { BodyProducts, BodyBudgets } from '@hm-dto/services.dto'
import { BreadCrumbs as BreadCrumbsDto } from '@hm-dto/components.dto'

import Module from '@hm-modules/CostOfLiving'

interface Props {
  resBudgets: BodyBudgets[]
  resProduct: BodyProducts[]
  breadcrumbs: BreadCrumbsDto[]
}

const Page: FC<Props> = ({ resProduct, resBudgets }) => (
  <Module
    budgets={resBudgets}
    products={resProduct}
  />
)

export const getStaticProps = async () => {
  const [
    { body: resProduct },
    { body: resBudgets }
  ] = await Promise.all([
    productService.getProducts(),
    masterService.getBudgets()
  ])

  return {
    props: {
      breadcrumbs: [
        { text: 'Home', path: '/' },
        { text: 'Cost of living' }
      ],
      resBudgets,
      resProduct
    }
  }
}

export default Page