"use client";

// import * as anchor from "@coral-xyz/anchor";
// import { Program, type Idl, AnchorProvider } from "@coral-xyz/anchor";
// import { useConnection } from "@solana/wallet-adapter-react";
// import { PublicKey } from "@solana/web3.js";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import toast from "react-hot-toast";
// // import { useCluster } from "../cluster/cluster-data-access";
// import { useAnchorProvider } from "../solana/solana-provider";
// import { useTransactionToast } from "../ui/ui-layout";

// // import type { CrudApp } from "../../../anchor/target/types/crud_app";
// // import idl from "../../idl/crud_app.json";
// import { IDL, type CrudApp } from "../../../anchor/target/types/crud_app";

// // const idlTyped = idl as unknown as CrudApp; // CrudApp is an IDL shape type

// // export function getJournalProgram(provider: AnchorProvider) {
// //   return new Program(idlTyped as unknown as Idl, provider) as Program<CrudApp>;
// // }

// // program id (devnet)
// const PROGRAM_ID = new PublicKey("Ewj4A5kLpcoe3Y8DrrohWuCFgtfkFG6F7D7cr3viweXY");
// export function getJournalProgram(provider: AnchorProvider) {
//   return new Program<CrudApp>(IDL, PROGRAM_ID, provider);
// }


import * as anchor from "@coral-xyz/anchor";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAnchorProvider } from "../solana/solana-provider";
import { useTransactionToast } from "../ui/ui-layout";
import { Program, AnchorProvider } from "@coral-xyz/anchor";

// import { IDL, type CrudApp } from "../../../anchor/target/types/crud_app";
import { IDL } from "../../idl/crud_app_idl";
// You can hardcode, or derive from IDL.address
//const PROGRAM_ID = new PublicKey("Ewj4A5kLpcoe3Y8DrrohWuCFgtfkFG6F7D7cr3viweXY");
const PROGRAM_ID = new PublicKey(IDL.address);
import type { CrudApp } from "../../../anchor/target/types/crud_app";
export function getJournalProgram(provider: AnchorProvider) {
  return new Program<CrudApp>(IDL as any, provider);
}

interface EntryArgs {
  title: string;
  message: string;
}

function journalEntryPda(title: string, owner: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(title, "utf8"), owner.toBuffer()],
    PROGRAM_ID
  )[0];
}

export function useJournalProgram() {
  const { connection } = useConnection();
  // const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const owner = provider.wallet.publicKey;

  const program = getJournalProgram(provider);
  const programId = PROGRAM_ID;

  const accounts = useQuery({
    queryKey: ["journal", "all" ],
    queryFn: () => program.account.journalEntryState.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ["get-program-account" ],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const createEntry = useMutation<string, Error, EntryArgs>({
    mutationKey: ["journalEntry", "create" ],
    mutationFn: async ({ title, message }) => {
      const owner = provider.wallet.publicKey;
      const pda = journalEntryPda(title, owner);

      return program.methods
        .createJournalEntry(title, message)
        .accounts({
          journalEntry: pda,
          owner,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      accounts.refetch();
    },
    onError: (error) => {
      toast.error(`Failed to create journal entry: ${error.message}`);
    },
  });

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    createEntry,
  };
}

export function useJournalProgramAccount({ account }: { account: PublicKey }) {
  // const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, accounts, programId } = useJournalProgram();
  const provider = useAnchorProvider();

  const accountQuery = useQuery({
    queryKey: ["journal", "fetch", { account }],
    queryFn: () => program.account.journalEntryState.fetch(account),
  });

  const updateEntry = useMutation<string, Error, EntryArgs>({
    mutationKey: ["journalEntry", "update" ],
    mutationFn: async ({ title, message }) => {
      const owner = provider.wallet.publicKey;
      const pda = journalEntryPda(title, owner);

      return program.methods
        .updateJournalEntry(title, message)
        .accounts({
          journalEntry: pda,
          owner,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      accounts.refetch();
    },
    onError: (error) => {
      toast.error(`Failed to update journal entry: ${error.message}`);
    },
  });

  const deleteEntry = useMutation<string, Error, { title: string }>({
    mutationKey: ["journal", "deleteEntry", { account }],
    mutationFn: async ({ title }) => {
      const owner = provider.wallet.publicKey;
      const pda = journalEntryPda(title, owner);

      return program.methods
        .deleteJournalEntry(title)
        .accounts({
          journalEntry: pda,
          owner,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
    },
    onSuccess: (sig) => {
      transactionToast(sig);
      return accounts.refetch();
    },
    onError: (error) => {
      toast.error(`Failed to delete journal entry: ${error.message}`);
    },
  });

  return {
    programId,
    accountQuery,
    updateEntry,
    deleteEntry,
  };
}
