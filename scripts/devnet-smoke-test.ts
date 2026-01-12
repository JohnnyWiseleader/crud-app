import fs from "fs";
import path from "path";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

const RPC = "https://api.devnet.solana.com";
const KEYPAIR_PATH = path.resolve(process.env.HOME!, ".config/solana/id.json");

// Your deployed program id (must match declare_id! and Anchor.toml)
const PROGRAM_ID = new PublicKey("Ewj4A5kLpcoe3Y8DrrohWuCFgtfkFG6F7D7cr3viweXY");

function loadKeypair(p: string) {
  const raw = JSON.parse(fs.readFileSync(p, "utf8"));
  return Keypair.fromSecretKey(Uint8Array.from(raw));
}

async function main() {
  const payer = loadKeypair(KEYPAIR_PATH);
  console.log("Server wallet:", payer.publicKey.toBase58());

  const connection = new Connection(RPC, "confirmed");
  const wallet = new anchor.Wallet(payer);
  const provider = new anchor.AnchorProvider(connection, wallet, { commitment: "confirmed" });
  anchor.setProvider(provider);

  // Build Anchor program from generated IDL (ESM-safe)
  const idlPath = path.resolve("anchor/target/idl/crud_app.json");
  const idl = JSON.parse(fs.readFileSync(idlPath, "utf8")) as anchor.Idl;
  const program = new anchor.Program(idl, provider);

  const title = `backend_${Date.now()}`;
  const message = "Hello from backend smoke test";
  const owner = payer.publicKey;

  // PDA must match your on-chain seeds: [title, owner]
  const [journalEntryPda] = PublicKey.findProgramAddressSync(
    [Buffer.from(title, "utf8"), owner.toBuffer()],
    PROGRAM_ID
  );

  console.log("Program:", PROGRAM_ID.toBase58());
  console.log("PDA:", journalEntryPda.toBase58());
  console.log("Title:", title);

  // CREATE
  const sigCreate = await program.methods
    .createJournalEntry(title, message)
    .accounts({
      journalEntry: journalEntryPda,
      owner,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .rpc();

  console.log("Create sig:", sigCreate);

  // UPDATE
  const sigUpdate = await program.methods
    .updateJournalEntry(title, "Updated from backend smoke test")
    .accounts({
      journalEntry: journalEntryPda,
      owner,
      systemProgram: anchor.web3.SystemProgram.programId, // keep if your IDL requires it
    })
    .rpc();

  console.log("Update sig:", sigUpdate);

  // DELETE
  const sigDelete = await program.methods
    .deleteJournalEntry(title)
    .accounts({
      journalEntry: journalEntryPda,
      owner,
      systemProgram: anchor.web3.SystemProgram.programId, // keep if your IDL requires it
    })
    .rpc();

  console.log("Delete sig:", sigDelete);

  console.log("Done ✅");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
