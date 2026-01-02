import { useMutation } from "@tanstack/react-query";
import { useConnection, useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { deleteJournalEntryTx } from "./crud-data-access";

export function useDeleteJournalEntry() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const { sendTransaction } = useWallet();

  return useMutation({
    mutationKey: ["crudapp", "delete"],
    mutationFn: async (vars: { title: string }) => {
      if (!wallet) throw new Error("Wallet not connected");

      const tx = await deleteJournalEntryTx({
        connection,
        wallet,
        title: vars.title,
      });

      return sendTransaction(tx, connection);
    },
  });
}
