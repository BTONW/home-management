import { MasterTypes } from '@hm-dto/utils.dto'
import { BodyBudgets } from '@hm-dto/services.dto'
import { masterService, productService } from '@hm-services/service'

interface Execute {
  type: MasterTypes
  request: Promise<any>
}

interface Props {
  [MasterTypes.BUDGETS]?: any[]
  [MasterTypes.PRODUCTS]?: any[]
}

const withMaster = async (
  cb?: () => Promise<any>,
  types: MasterTypes[] = [
    MasterTypes.BUDGETS,
    MasterTypes.PRODUCTS
  ],
) => {
  const props: Props = {}
  const execute: Execute[] = []

  types.forEach(type => {
    switch (type) {
      case MasterTypes.BUDGETS:
        execute.push({
          type: MasterTypes.BUDGETS,
          request: masterService.getBudgets<BodyBudgets>()
        })
        break
      case MasterTypes.PRODUCTS:
        execute.push({
          type: MasterTypes.PRODUCTS,
          request: productService.getProducts()
        })
        break
    }
  })

  const responses = await Promise.all(execute.map(exe => exe.request))

  execute.forEach((exe, index) => {
    props[exe.type] = responses[index]?.body || []
  })

  const pageProps = cb
    ? await cb()
    : {}

  return {
    props: {
      _withMaster: props,
      ...pageProps
    }
  }
}

export default withMaster