import { duckAddresses } from '../constants'
import { submitMigrationQuack } from '../contracts/migration/contractFunctions'

const migrate = async (metamask: any, colAmount: string, skipGasEstimation = false, onSuccessfulSend: Function) => {
  const options: any = {}
  if (skipGasEstimation) {
    options.gasLimit = 100000
  }
  const { signer, chainId } = metamask

  const tx = await submitMigrationQuack(duckAddresses[chainId], signer, options)

  if (!tx.error) {
    onSuccessfulSend()
  }

  console.log(tx)
  await tx.wait()
}

function useContracts() {
  return { migrate }
}

export default useContracts
