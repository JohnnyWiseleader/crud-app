import { useMutation } from '@tanstack/react-query'
import { PublicKey } from '@solana/web3.js'
import { useSolana } from '@/components/solana/use-solana'
import { createJournalEntryTx } from './crud-data-access'

function getConnectionFromGillClient(client: any) {
  return client?.rpc?.connection ?? client?.connection ?? client?.cluster?.connection
}

async function sendWithGill(client: any, tx: any) {
  // Prefer "sendAndConfirm" if present
  if (client?.rpc?.sendAndConfirmTransaction) {
    return client.rpc.sendAndConfirmTransaction(tx)
  }
  // Otherwise send only
  if (client?.rpc?.sendTransaction) {
    return client.rpc.sendTransaction(tx)
  }
  throw new Error('Gill client: no known send method found')
}

export function useCreateJournalEntry() {
  const { client, account } = useSolana()

  return useMutation({
    mutationKey: ['crudapp', 'create'],
    mutationFn: async (vars: { title: string; message: string }) => {
      if (!account?.address) throw new Error('Wallet not connected')

      const connection = getConnectionFromGillClient(client)
      if (!connection) throw new Error('No Solana connection available from client')

      const owner = new PublicKey(account.address)

      const tx = await createJournalEntryTx({
        connection,
        owner,
        title: vars.title,
        message: vars.message,
      })

      return sendWithGill(client, tx)
    },
  })
}
