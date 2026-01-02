import { useMutation } from "@tanstack/react-query";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { deleteJournalEntryTx } from "./crud-data-access";

export function useDeleteJournalEntry() {
  const { connection } = useConnection();
  const wallet = useWallet();

  return useMutation({
    mutationKey: ["crudapp", "delete"],
    mutationFn: async (vars: { title: string }) => {
      const adapter = wallet.wallet?.adapter;
      if (!wallet.publicKey || !adapter) throw new Error("Wallet not connected");

      const tx = await deleteJournalEntryTx({
        connection,
        walletAdapter: adapter,
        title: vars.title,
      });

      return wallet.sendTransaction(tx, connection);
    },
  });
}
