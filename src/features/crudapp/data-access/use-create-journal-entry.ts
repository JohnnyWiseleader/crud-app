import { useMutation } from "@tanstack/react-query";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { createJournalEntryTx } from "./crud-data-access";

export function useCreateJournalEntry() {
  const { connection } = useConnection();
  const wallet = useWallet();

  return useMutation({
    mutationKey: ["crudapp", "create"],
    mutationFn: async (vars: { title: string; message: string }) => {
      const adapter = wallet.wallet?.adapter;
      if (!wallet.publicKey || !adapter) throw new Error("Wallet not connected");

      const tx = await createJournalEntryTx({
        connection,
        walletAdapter: adapter,
        title: vars.title,
        message: vars.message,
      });

      return wallet.sendTransaction(tx, connection);
    },
  });
}
