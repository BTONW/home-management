import { AxiosRequestConfig } from 'axios'
import ResfulApi from '@hm-utils/ResfulApi'

class Service extends ResfulApi {
  constructor() {
    super('/master')
  }
  
  getMonths = <T>(option?: AxiosRequestConfig) => this.apiGet<T>('/months', option)

  getBudgets = <T>(option?: AxiosRequestConfig) => this.apiGet<T>('/budgets', option)
}

export const masterService = new Service()

export default Service