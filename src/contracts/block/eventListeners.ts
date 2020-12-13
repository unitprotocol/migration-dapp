import eventTracker from '../websocketEventTracker'

const trackBlockHeader = callback => eventTracker.trackBlockHeader(callback)

export { trackBlockHeader }
