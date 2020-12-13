import bn from 'bignumber.js'
import _ from 'lodash'

import { colAddresses, colMockAddresses, ethMockAddress, tokenByAddress, tokens, usdpAddresses } from './constants'

bn.config({ EXPONENTIAL_AT: 1e9 })

export function getTokenAddressFromSymbol(tokenSymbol: string) {
  return _.get(
    tokens.find(({ symbol }) => symbol === tokenSymbol),
    'address',
  )
}

export function getAtomicAmountFromDisplayAmount(amount: string, tokenAddress: string) {
  if (amount === '0' || Object.values(colMockAddresses).includes(tokenAddress)) return '0'
  const token = tokens.find(({ addresses }) => Object.values(addresses).includes(tokenAddress.toLowerCase()))
  if (!token) {
    throw new Error(`Unexpected token ${tokenAddress}`)
  }
  const { decimals } = token
  const num = new bn(amount || 0).times(10 ** decimals).toString()
  if (num.includes('.')) return num.substr(0, num.indexOf('.'))
  return num
}

export function getDisplayAmountFromAtomicAmount(amount: string, tokenAddress: string, cut = true) {
  if (amount === '0') return '0'
  const token = tokenByAddress(tokenAddress)
  if (!token) {
    throw new Error(`Unexpected token ${tokenAddress}`)
  }
  const { decimals } = token

  const res = new bn(amount || 0).dividedBy(10 ** decimals).toString()
  if (cut) {
    const isUsdp = Object.values(usdpAddresses).includes(tokenAddress)
    const isCol = Object.values(colAddresses).includes(tokenAddress)
    if (isUsdp || isCol) {
      if (res.includes('.')) {
        return Number(res.substr(0, res.indexOf('.') + 3)).toFixed(2)
      }
      return Number(res).toFixed(2)
    }
    if (res.includes('.')) return res.substr(0, res.indexOf('.') + 5)
  }
  return res
}

export function cutSomeEthToCoverFee(amount: string) {
  const fee = new bn(10).pow(17)
  const amnt = new bn(amount).times(new bn(10).pow(18))
  if (amnt.comparedTo(fee) === 1) {
    return getDisplayAmountFromAtomicAmount(amnt.minus(fee).toString(), ethMockAddress[4], false)
  }
  return '0'
}

export function getDisplayUSDAmountFromAtomicUSDAmount(amount: string) {
  return new bn(amount || 0).dividedBy(10 ** 18).toFixed(4)
}

export function sqrt(value: bigint) {
  if (value < 0n) {
    throw new Error('square root of negative numbers is not supported')
  }

  if (value < 2n) {
    return value
  }

  function newtonIteration(n, x0) {
    // eslint-disable-next-line no-bitwise
    const x1 = (n / x0 + x0) >> 1n
    if (x0 === x1 || x0 === x1 - 1n) {
      return x0
    }
    return newtonIteration(n, x1)
  }

  return newtonIteration(value, 1n)
}
