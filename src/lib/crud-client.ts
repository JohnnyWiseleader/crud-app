import type { Address } from "@solana/kit";
import { PublicKey } from "@solana/web3.js";

// Re-export Codama-generated instruction builders
export {
  getCreateJournalEntryInstructionAsync,
} from "@/../clients/js/src/generated/instructions/createJournalEntry";

export {
  getUpdateJournalEntryInstructionAsync,
} from "@/../clients/js/src/generated/instructions/updateJournalEntry";

export {
  getDeleteJournalEntryInstructionAsync,
} from "@/../clients/js/src/generated/instructions/deleteJournalEntry";

// Program-level exports
import {
  CRUD_APP_PROGRAM_ADDRESS as CODAMA_PROGRAM_ADDRESS,
} from "@/../clients/js/src/generated/programs";

// Convert Codama Address → web3.js PublicKey (once)
export const CRUD_APP_PROGRAM_ID = new PublicKey(
  CODAMA_PROGRAM_ADDRESS as unknown as string
);

// (optional) expose raw address if you want to stay in @solana/kit land
export const CRUD_APP_PROGRAM_ADDRESS: Address =
  CODAMA_PROGRAM_ADDRESS;
