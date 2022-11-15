import { AxiosRequestConfig } from 'axios'
import { BodyBalance, BodyUpsertBalance } from '@hm-dto/services.dto'
import ResfulApi from '@hm-utils/ResfulApi'

class Service extends ResfulApi {
  constructor() {
    super('/balance')
  }

  getBalance = <T = BodyBalance[]>(option?: AxiosRequestConfig) => this.apiGet<T>('/', option)

  upsertBalance = <T = BodyBalance, P = BodyUpsertBalance>(params: P, option?: AxiosRequestConfig) =>
    this.apiPost<T>('/upsert', params, option)
}

export const balanceService = new Service()

export default Service