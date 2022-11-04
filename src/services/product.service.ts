import { AxiosRequestConfig } from 'axios'
import ResfulApi from '@hm-utils/ResfulApi'

class Service extends ResfulApi {
  constructor() {
    super('/product')
  }

  getProducts = (option?: AxiosRequestConfig) =>
    this.apiGet('/', option)
}

export const productService = new Service()

export default Service