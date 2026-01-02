import { useMutation } from "@tanstack/react-query";
import { useConnection, useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { createJournalEntryTx } from "./crud-data-access";

export function useCreateJournalEntry() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const { sendTransaction } = useWallet();

  return useMutation({
    mutationKey: ["crudapp", "create"],
    mutationFn: async (vars: { title: string; message: string }) => {
      if (!wallet) throw new Error("Wallet not connected");

      const tx = await createJournalEntryTx({
        connection,
        wallet,
        title: vars.title,
        message: vars.message,
      });

      return sendTransaction(tx, connection);
    },
  });
}