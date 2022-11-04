import { AxiosRequestConfig } from 'axios'
import ResfulApi from '@hm-utils/ResfulApi'

class Service extends ResfulApi {
  constructor() {
    super('/master')
  }

  getMonths = (option?: AxiosRequestConfig) =>
    this.apiGet('/months', option)
}

export const masterService = new Service()

export default Service