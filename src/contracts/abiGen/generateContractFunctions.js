/* eslint-disable global-require */
/* eslint-disable no-shadow */
const _ = require('lodash')
const { getContractFunctionName, getInterface } = require('./utils')

function getInputNames(inputs) {
  return _.map(inputs, ({ name, type }, i) => name || `${type}Input${i + 1}`)
}

function buildContractFunctionParams(inputs, type, payable, contractKey) {
  let parameters = getInputNames(inputs)

  if (type === 'transaction') {
    parameters.push('signer')
    parameters.push('options = {}')
  }
  if (payable && type !== 'call') {
    parameters = ['ethAmount', ...parameters]
  }

  if (!contractKey) {
    parameters = ['contractAddress', ...parameters]
  }

  return parameters
}

function generateEthersTransactionOptions(payable, type) {
  if (type === 'transaction') {
    const payableString = payable ? ', value: ethAmount' : ''
    return `{ ...options${payableString} }`
  }
  return ''
}

function generateReturnString(constant, name, inputNames, options) {
  const formattedOptions = options === '' ? '' : inputNames.length ? `, ${options}` : `${options}`
  const fnParams = `${inputNames.join(', ')}${formattedOptions}`
  let result = constant
    ? `  return contract.${name}(${fnParams})`
    : `  return sendTransaction(contract, '${name}', [${fnParams}])`
  if (result.length > 120) {
    const formattedOptions = options === '' ? '' : inputNames.length ? `,\n    ${options},` : `${options}`
    const fnParams = `
    ${inputNames.join(',\n    ')}${formattedOptions}\n  `
    result = constant
      ? `  return contract.${name}(${fnParams})`
      : `  return sendTransaction(contract, '${name}', [${fnParams}])`
  }
  return result
}

function generateFirstFunctionString(functionName, parameters) {
  const functionArgs = parameters.length ? `${parameters.join(', ')}` : ''
  const result = `function ${functionName}(${functionArgs}) {`

  if (result.length > 120) {
    const functionArgs = `\n  ${parameters.join(',\n  ')},\n`
    return `function ${functionName}(${functionArgs}) {`
  }
  return result
}

function generateContractFunctions(abiLocation, contractKey, eventNamespace = '') {
  const abi = require(`../${abiLocation}`)
  const contractFunctions = _.uniq(_.values(getInterface(abi).functions))

  let hasTransactions = false

  const functionArray = contractFunctions.map(({ inputs, payable, constant, name }) => {
    const type = constant ? 'call' : 'transaction'
    if (!constant && !hasTransactions) hasTransactions = true
    const parameters = buildContractFunctionParams(inputs, type, payable, contractKey)
    const getContract = type === 'transaction' ? 'signer' : 'constants.ethersProvider'
    const lastParamContractAddress = contractKey ? '' : ', contractAddress'
    const functionName = getContractFunctionName(type, name, eventNamespace)
    const inputNames = getInputNames(inputs)
    const options = `${generateEthersTransactionOptions(payable, type)}`

    const returnString = generateReturnString(constant, name, inputNames, options)
    const firstString = generateFirstFunctionString(functionName, parameters)

    return `${firstString}
  const contract = get${_.upperFirst(eventNamespace)}Contract(${getContract}${lastParamContractAddress})
${returnString}
}
`
  })
  const passedInContractAddress = contractKey ? '' : ', contractAddress'
  const contractConstantsImport = `\nimport * as constants from '../../constants'\n${
    hasTransactions ? "import { sendTransaction } from '../../state/transactionsSubject'\n" : ''
  }`
  const contractAddress = contractKey ? `constants.${contractKey}` : 'contractAddress'

  return (
    `import * as ethers from 'ethers'\n` +
    `${contractConstantsImport}import abi from '../${abiLocation}'\n\n` +
    `function get${_.upperFirst(eventNamespace)}Contract(provider${passedInContractAddress}) {
  return new ethers.Contract(${contractAddress}, abi, provider)
}

${functionArray.join('\n')}
export {${contractFunctions.map(({ name, constant }) => {
      return `\n  ${getContractFunctionName(constant ? 'call' : 'transaction', name, eventNamespace)}`
    })},
}
`
  )
}

module.exports = generateContractFunctions
