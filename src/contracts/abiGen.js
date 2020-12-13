/* eslint-disable */

const fs = require('fs')
const generateContractFunctions = require('./abiGen/generateContractFunctions')
const generateEventListeners = require('./abiGen/generateEventListeners')
const { getInterfaceEvents } = require('./abiGen/utils')

const modules = [
  {
    abiLocation: 'abis/ERC20.json',
    namespace: 'erc20Token',
  },
  {
    abiLocation: 'abis/Migration.json',
    namespace: 'migration',
    contractKey: 'migration',
  },
]

modules.map(createSubmodules)

function createSubmodules({ abiLocation, namespace, contractKey }) {
  fs.mkdir(`./${namespace.toLowerCase()}/`, { recursive: true }, err => {
    if (err) throw err
    const events = getInterfaceEvents(require(`./${abiLocation}`))
    if (events.length) {
      fs.writeFileSync(
        `./${namespace.toLowerCase()}/eventListeners.ts`,
        generateEventListeners(abiLocation, contractKey, namespace),
      )
    }
    fs.writeFileSync(
      `./${namespace.toLowerCase()}/contractFunctions.ts`,
      generateContractFunctions(abiLocation, contractKey, namespace),
    )
  })
}

module.exports = createSubmodules
