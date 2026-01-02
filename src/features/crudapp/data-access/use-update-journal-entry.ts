import { useMutation } from "@tanstack/react-query";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { updateJournalEntryTx } from "./crud-data-access";

export function useUpdateJournalEntry() {
  const { connection } = useConnection();
  const wallet = useWallet();

  return useMutation({
    mutationKey: ["crudapp", "update"],
    mutationFn: async (vars: { title: string; message: string }) => {
      const adapter = wallet.wallet?.adapter;
      if (!wallet.publicKey || !adapter) throw new Error("Wallet not connected");

      const tx = await updateJournalEntryTx({
        connection,
        walletAdapter: adapter,
        title: vars.title,
        message: vars.message,
      });

      return wallet.sendTransaction(tx, connection);
    },
  });
}
