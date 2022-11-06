import { AxiosRequestConfig } from 'axios'

import { BodyProducts } from '@hm-dto/services.dto'

import ResfulApi from '@hm-utils/ResfulApi'

class Service extends ResfulApi {
  constructor() {
    super('/product')
  }

  getProducts = (option?: AxiosRequestConfig) => this.apiGet<BodyProducts>('/', option)
  
}

export const productService = new Service()

export default Service