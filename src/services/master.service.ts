import { AxiosRequestConfig } from 'axios'
import { BodyBalance } from '@hm-dto/services.dto'
import ResfulApi from '@hm-utils/ResfulApi'

class Service extends ResfulApi {
  constructor() {
    super('/master')
  }

  getBalance = <T = BodyBalance>(option?: AxiosRequestConfig) => this.apiGet<T>('/balance', option)

  getMonths = <T>(option?: AxiosRequestConfig) => this.apiGet<T>('/months', option)

  getBudgets = <T>(option?: AxiosRequestConfig) => this.apiGet<T>('/budgets', option)
}

export const masterService = new Service()

export default Service