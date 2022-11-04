export enum HttpStatus {
  OK           = 200,
  NO_CONTENT   = 204,
  BAD_REQUEST  = 400,
  UN_AUTHORIZE = 401,
  FORBIDDEN    = 403,
  NOT_FOUND    = 404,
  SERVER_ERROR = 500,
}

export interface ResfulApiResponse<T = any> {
  body: T
  success: boolean
  message: string
  total: number | null
  statusCode: HttpStatus
}

export interface PublicRuntimeConfig {
  timeout: string
  environment: string
  endpoint: {
    api: string
    web: string
  }
}