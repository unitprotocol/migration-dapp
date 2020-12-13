export interface ContractAddresses {
  [chainId: number]: string
}

export interface Token {
  decimals: number
  symbol: string
  addresses: ContractAddresses
  collateral: boolean
  useWeth?: boolean
  poolTokens?: boolean | string[]
  logoUrl?: string
  defaultOracleType?: number
}
