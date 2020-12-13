import abi from '../abis/ERC20.json'
import eventTracker from '../websocketEventTracker'

const trackErc20TokenApproval = ({ callback, owner, spender, contract }, eventForAddress) =>
  eventTracker.trackEvent(
    {
      callback,
      contract,
      abi,
      name: 'Approval',
      params: { owner, spender, contract },
      topic: '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
      namespace: 'erc20Token',
    },
    eventForAddress,
  )

const trackErc20TokenTransfer = ({ callback, from, to, contract }, eventForAddress) =>
  eventTracker.trackEvent(
    {
      callback,
      contract,
      abi,
      name: 'Transfer',
      params: { from, to, contract },
      topic: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      namespace: 'erc20Token',
    },
    eventForAddress,
  )
export { trackErc20TokenApproval, trackErc20TokenTransfer }
