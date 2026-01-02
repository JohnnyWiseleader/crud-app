// src/features/crudapp/data-access/crud-data-access.ts
import * as anchor from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import type { AnchorWallet } from "@solana/wallet-adapter-react";
import idl from "@/idl/crud_app.json";

const PROGRAM_ID = new PublicKey((idl as any).address);

function getProgram(connection: anchor.web3.Connection, wallet: AnchorWallet) {
  const provider = new anchor.AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });

  return new anchor.Program(idl as anchor.Idl, provider);
}

function journalEntryPda(title: string, owner: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(title, "utf8"), owner.toBuffer()],
    PROGRAM_ID
  )[0];
}

export async function createJournalEntryTx(params: {
  connection: anchor.web3.Connection;
  wallet: AnchorWallet;
  title: string;
  message: string;
}) {
  const program = getProgram(params.connection, params.wallet);
  const pda = journalEntryPda(params.title, params.wallet.publicKey);

  return program.methods
    .createJournalEntry(params.title, params.message)
    .accounts({
      journalEntry: pda,
      owner: params.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .transaction();
}

export async function updateJournalEntryTx(params: {
  connection: anchor.web3.Connection;
  wallet: AnchorWallet;
  title: string;
  message: string;
}) {
  const program = getProgram(params.connection, params.wallet);
  const pda = journalEntryPda(params.title, params.wallet.publicKey);

  return program.methods
    .updateJournalEntry(params.title, params.message)
    .accounts({
      journalEntry: pda,
      owner: params.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .transaction();
}

export async function deleteJournalEntryTx(params: {
  connection: anchor.web3.Connection;
  wallet: AnchorWallet;
  title: string;
}) {
  const program = getProgram(params.connection, params.wallet);
  const pda = journalEntryPda(params.title, params.wallet.publicKey);

  return program.methods
    .deleteJournalEntry(params.title)
    .accounts({
      journalEntry: pda,
      owner: params.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .transaction();
}
