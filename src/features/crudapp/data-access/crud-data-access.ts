import * as anchor from '@coral-xyz/anchor'
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js'
import idl from '@/idl/crud_app.json'

// Program id from your IDL (Codama / create-solana-dapp style)
export const PROGRAM_ID = new PublicKey((idl as any).address)

// We only need an Anchor Provider so Anchor can build the tx via .transaction().
// For building transactions, we can pass a "dummy" wallet object.
function getProgram(connection: Connection) {
  const dummyWallet = {} as any
  const provider = new anchor.AnchorProvider(connection as any, dummyWallet, {
    commitment: 'confirmed',
  })

  return new anchor.Program(idl as anchor.Idl, provider)
}

/**
 * PDA for a journal entry.
 * IMPORTANT: must match on-chain seeds exactly.
 */
export function journalEntryPda(title: string, owner: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(title, 'utf8'), owner.toBuffer()],
    PROGRAM_ID
  )
}

export async function createJournalEntryTx(params: {
  connection: Connection
  owner: PublicKey
  title: string
  message: string
}) {
  const program = getProgram(params.connection)
  const [pda] = journalEntryPda(params.title, params.owner)

  return program.methods
    .createJournalEntry(params.title, params.message)
    .accounts({
      journalEntry: pda,
      owner: params.owner,
      systemProgram: SystemProgram.programId,
    })
    .transaction()
}

export async function updateJournalEntryTx(params: {
  connection: Connection
  owner: PublicKey
  title: string
  message: string
}) {
  const program = getProgram(params.connection)
  const [pda] = journalEntryPda(params.title, params.owner)

  return program.methods
    .updateJournalEntry(params.title, params.message)
    .accounts({
      journalEntry: pda,
      owner: params.owner,
    })
    .transaction()
}

export async function deleteJournalEntryTx(params: {
  connection: Connection
  owner: PublicKey
  title: string
}) {
  const program = getProgram(params.connection)
  const [pda] = journalEntryPda(params.title, params.owner)

  return program.methods
    .deleteJournalEntry(params.title)
    .accounts({
      journalEntry: pda,
      owner: params.owner,
    })
    .transaction()
}
