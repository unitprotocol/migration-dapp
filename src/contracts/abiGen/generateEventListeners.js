/* eslint-disable */
const _ = require('lodash')
const Web3 = require('web3')

const web3 = new Web3()

const { getInterfaceEvents } = require('./utils')

function generateEventListeners(abiLocation, contractKey, eventNamespace = '') {
  const abi = require(`../${abiLocation}`)
  const actionsTextArray = getInterfaceEvents(abi).map(({ name, inputs }) => {
    const filteredInputs = _.map(_.filter(inputs, { indexed: true }), 'name')
    if (!contractKey) {
      filteredInputs.push('contract')
    }

    const functionName = `track${_.upperFirst(eventNamespace)}${name}`

    let eventForAdderssTop = ''
    let eventForAdderss = ''
    if (functionName.includes('Erc20')) {
      eventForAdderssTop = ', eventForAddress'
      eventForAdderss = ',\n    eventForAddress,\n  '
    }

    const eventForAddressPrefix = eventForAdderss ? '  ' : ''
    const contractString = contractKey
      ? `\n    ${eventForAddressPrefix}contract: constants.${contractKey},`
      : `\n    ${eventForAddressPrefix}contract,`
    const inputsOuterParam = filteredInputs.length ? `${filteredInputs.join(', ')}` : ''
    const eventString = `${name}(${inputs.map(i => i.type).join(',')})`
    const topic = web3.utils.sha3(eventString)
    return `const ${functionName} = ({ callback, ${inputsOuterParam} }${eventForAdderssTop}) =>
  eventTracker.trackEvent(${eventForAdderss ? '\n    ' : ''}{
    ${eventForAddressPrefix}callback,${contractString}
    ${eventForAddressPrefix}abi,
    ${eventForAddressPrefix}name: '${name}',
    ${eventForAddressPrefix}params: { ${filteredInputs.join(', ')} },
    ${eventForAddressPrefix}topic: '${topic}',
    ${eventForAddressPrefix}namespace: '${eventNamespace}',
  ${eventForAddressPrefix}}${eventForAdderss})
`
  })
  const contractContantsImport = contractKey ? `import * as constants from '../../constants'\n` : ''
  return (
    `${contractContantsImport}import abi from '../${abiLocation}'\n` +
    `import eventTracker from '../websocketEventTracker'\n\n` +
    `${actionsTextArray.join('\n')}` +
    `export { ${getInterfaceEvents(abi)
      .map(({ name }) => `track${_.upperFirst(eventNamespace)}${name}`)
      .join(', ')} }\n`
  )
}

module.exports = generateEventListeners
