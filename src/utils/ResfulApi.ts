import https from 'http'
import getConfig from 'next/config'
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ResfulApiResponse, PublicRuntimeConfig } from '@hm-dto/utils.dto'

class ResfulApi {
  private api!: AxiosInstance
  private app!: AxiosInstance
  private successResponse = ({ data }: AxiosResponse) => data
  private failedResponse = (error: AxiosError) => Promise.resolve(error.response)

  public endpointApi: string

  constructor(endpointApi: string = '') {
    this.endpointApi = endpointApi
    
    const { publicRuntimeConfig } = getConfig()
    const { endpoint, timeout } = publicRuntimeConfig as PublicRuntimeConfig

    this.api = axios.create({
      timeout: parseInt(timeout),
      baseURL: String(`${endpoint.api}${this.endpointApi}`),
      httpsAgent: new https.Agent()
    })
    this.app = axios.create({
      timeout: parseInt(timeout),
      baseURL: String(endpoint.web),
      httpsAgent: new https.Agent()
    })

    this.api.interceptors.request.use(config => {
      const token = 'BTONW'
      if (config.headers) {
        config.headers.Authorization = token
          ? `Bearer ${token}`
          : ''
      }
      return config
    })

    this.api.interceptors.response.use(this.successResponse, this.failedResponse)
    this.app.interceptors.response.use(this.successResponse, this.failedResponse)
  }

  protected setAuthorize = (token?: string, type: string = 'Bearer'): AxiosRequestConfig => ({
    headers: {
      Authorization: `${type} ${token}`
    }
  })

  protected apiGet = (url: string, option?: AxiosRequestConfig): Promise<ResfulApiResponse> =>
    this.api.get(url, option)
  protected apiPost = (url: string, params?: any, option?: AxiosRequestConfig): Promise<ResfulApiResponse> =>
    this.api.post(url, params, option)
  protected apiPut = (url: string, params?: any, option?: AxiosRequestConfig): Promise<ResfulApiResponse> =>
    this.api.put(url, params, option)
  protected apiPatch = (url: string, params?: any, option?: AxiosRequestConfig): Promise<ResfulApiResponse> =>
    this.api.patch(url, params, option)
  protected apiDel = (url: string, option?: AxiosRequestConfig): Promise<ResfulApiResponse> =>
    this.api.delete(url, option)

  protected appGet = (url: string, option?: AxiosRequestConfig): Promise<ResfulApiResponse> =>
    this.app.get(url, option)
  protected appPost = (url: string, params?: any, option?: AxiosRequestConfig): Promise<ResfulApiResponse> =>
    this.app.post(url, params, option)
  protected appPut = (url: string, params?: any, option?: AxiosRequestConfig): Promise<ResfulApiResponse> =>
    this.app.put(url, params, option)
  protected appDelete = (url: string, option?: AxiosRequestConfig): Promise<ResfulApiResponse> =>
    this.app.delete(url, option)
}

export default ResfulApi
