import { AxiosRequestConfig } from 'axios'
import ResfulApi from '@hm-utils/ResfulApi'

class Service extends ResfulApi {
  constructor() {
    super('/cost-value')
  }

  getCostValuesByDays = <T>(option?: AxiosRequestConfig) => this.apiGet<T>('/days', option)
  
}

export const costValueService = new Service()

export default Service