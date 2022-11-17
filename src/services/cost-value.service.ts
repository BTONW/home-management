import { AxiosRequestConfig } from 'axios'
import ResfulApi from '@hm-utils/ResfulApi'

class Service extends ResfulApi {
  constructor() {
    super('/cost-value')
  }

  getCostValues = <T>(option?: AxiosRequestConfig) => this.apiGet<T>('/', option)

  getCostValuesByDays = <T>(option?: AxiosRequestConfig) => this.apiGet<T>('/days', option)

  createCostValues = <T, P>(params: P, option?: AxiosRequestConfig) => this.apiPost<T>('/create', params, option)

  updateCostValues = <T, P>(params: P, option?: AxiosRequestConfig) => this.apiPut<T>('/update', params, option)
  
}

export const costValueService = new Service()

export default Service