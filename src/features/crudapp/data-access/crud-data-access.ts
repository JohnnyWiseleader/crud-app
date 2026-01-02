import * as anchor from "@coral-xyz/anchor";
import { PublicKey, SystemProgram, Connection } from "@solana/web3.js";
import type { WalletAdapter } from "@solana/wallet-adapter-base";
import { Buffer } from "buffer";
import { toAnchorWallet } from "@/lib/solana/anchorWallet";

import idl from "../../../../anchor/target/idl/crud_app.json";

const PROGRAM_ID = new PublicKey((idl as any).address);

export async function createJournalEntryTx(params: {
  connection: Connection;
  walletAdapter: WalletAdapter;
  title: string;
  message: string;
}) {
  const wallet = toAnchorWallet(params.walletAdapter);

  const provider = new anchor.AnchorProvider(params.connection, wallet, {
    commitment: "confirmed",
  });

  const program = new anchor.Program(idl as anchor.Idl, provider);

  const [journalEntryPda] = PublicKey.findProgramAddressSync(
    [Buffer.from(params.title, "utf8"), wallet.publicKey.toBuffer()],
    PROGRAM_ID
  );

  return await program.methods
    .createJournalEntry(params.title, params.message)
    .accounts({
      journalEntry: journalEntryPda,
      owner: wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .transaction();
}

export async function updateJournalEntryTx(params: {
  connection: Connection;
  walletAdapter: WalletAdapter;
  title: string;      // this is the _title arg in your IDL
  message: string;
}) {
  const wallet = toAnchorWallet(params.walletAdapter);

  const provider = new anchor.AnchorProvider(params.connection, wallet, {
    commitment: "confirmed",
  });

  const program = new anchor.Program(idl as anchor.Idl, provider);

  const [journalEntryPda] = PublicKey.findProgramAddressSync(
    [Buffer.from(params.title, "utf8"), wallet.publicKey.toBuffer()],
    PROGRAM_ID
  );

  return await program.methods
    .updateJournalEntry(params.title, params.message)
    .accounts({
      journalEntry: journalEntryPda,
      owner: wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .transaction();
}

export async function deleteJournalEntryTx(params: {
  connection: Connection;
  walletAdapter: WalletAdapter;
  title: string; // this is the _title arg in your IDL
}) {
  const wallet = toAnchorWallet(params.walletAdapter);

  const provider = new anchor.AnchorProvider(params.connection, wallet, {
    commitment: "confirmed",
  });

  const program = new anchor.Program(idl as anchor.Idl, provider);

  const [journalEntryPda] = PublicKey.findProgramAddressSync(
    [Buffer.from(params.title, "utf8"), wallet.publicKey.toBuffer()],
    PROGRAM_ID
  );

  return await program.methods
    .deleteJournalEntry(params.title)
    .accounts({
      journalEntry: journalEntryPda,
      owner: wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .transaction();
}
