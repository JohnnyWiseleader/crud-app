import type { WalletAdapter } from "@solana/wallet-adapter-base";
import type { Wallet } from "@coral-xyz/anchor";
import type { PublicKey, Transaction } from "@solana/web3.js";

export function toAnchorWallet(adapter: WalletAdapter): Wallet {
  if (!adapter.publicKey || !adapter.signTransaction) {
    throw new Error("Wallet not ready");
  }

  return {
    publicKey: adapter.publicKey as PublicKey,
    signTransaction: adapter.signTransaction.bind(adapter) as any,
    signAllTransactions: adapter.signAllTransactions?.bind(adapter) as any,
  };
}
