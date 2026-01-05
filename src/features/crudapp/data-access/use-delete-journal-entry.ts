import { useMutation } from '@tanstack/react-query'
import { PublicKey } from '@solana/web3.js'
import { useSolana } from '@/components/solana/use-solana'
import { deleteJournalEntryTx } from './crud-data-access'

function getConnectionFromGillClient(client: any) {
  return client?.rpc?.connection ?? client?.connection ?? client?.cluster?.connection
}

async function sendWithGill(client: any, tx: any) {
  if (client?.rpc?.sendAndConfirmTransaction) {
    return client.rpc.sendAndConfirmTransaction(tx)
  }
  if (client?.rpc?.sendTransaction) {
    return client.rpc.sendTransaction(tx)
  }
  throw new Error('Gill client: no known send method found')
}

export function useDeleteJournalEntry() {
  const { client, account } = useSolana()

  return useMutation({
    mutationKey: ['crudapp', 'delete'],
    mutationFn: async (vars: { title: string }) => {
      if (!account?.address) throw new Error('Wallet not connected')

      const connection = getConnectionFromGillClient(client)
      if (!connection) throw new Error('No Solana connection available from client')

      const owner = new PublicKey(account.address)

      const tx = await deleteJournalEntryTx({
        connection,
        owner,
        title: vars.title,
      })

      return sendWithGill(client, tx)
    },
  })
}
