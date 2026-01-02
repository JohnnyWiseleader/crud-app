import { useMutation } from "@tanstack/react-query";
import { useConnection, useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { updateJournalEntryTx } from "./crud-data-access";

export function useUpdateJournalEntry() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const { sendTransaction } = useWallet();

  return useMutation({
    mutationKey: ["crudapp", "update"],
    mutationFn: async (vars: { title: string; message: string }) => {
      if (!wallet) throw new Error("Wallet not connected");

      const tx = await updateJournalEntryTx({
        connection,
        wallet,
        title: vars.title,
        message: vars.message,
      });

      return sendTransaction(tx, connection);
    },
  });
}
