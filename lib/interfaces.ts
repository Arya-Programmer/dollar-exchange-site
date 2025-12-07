export interface ExchangeRate {
  id: number
  city: string
  rate_type: string
  rate: number
  timestamp: string
  message_id?: number

  max_rate?: number
  average_rate?: number
  min_rate?: number
  week_number?: number
}

export interface ExchangeRateApiProp {
  cityData: ExchangeRate[],
  loading: boolean,
  error: string | null,
  fetchData: any
}
