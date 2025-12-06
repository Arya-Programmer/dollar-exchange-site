export interface ExchangeRate {
  id: number
  city: string
  rate_type: string
  rate: number
  timestamp: string
  message_id?: number
}

export interface ExchangeRateApiProp {
  cityData: ExchangeRate[],
  loading: boolean,
  error: string | null,
  fetchCityData: () => Promise<void>
}
