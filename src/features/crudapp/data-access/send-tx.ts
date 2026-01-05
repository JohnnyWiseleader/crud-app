import type { Connection, Transaction, VersionedTransaction } from "@solana/web3.js";

type AnyTx = Transaction | VersionedTransaction;

/**
 * Try to locate a web3.js Connection on various possible Gill client shapes.
 */
export function getConnection(client: any): Connection {
  const c =
    client?.connection ??
    client?.rpc?.connection ??
    client?.rpc?.getConnection?.() ??
    client?.cluster?.connection ??
    client?.provider?.connection;

  if (!c) {
    // Helpful diagnostics
    // eslint-disable-next-line no-console
    console.error("Gill client shape:", {
      clientKeys: Object.keys(client ?? {}),
      rpcKeys: Object.keys(client?.rpc ?? {}),
      clusterKeys: Object.keys(client?.cluster ?? {}),
      providerKeys: Object.keys(client?.provider ?? {}),
    });
    throw new Error("Could not locate Connection on Gill client. Check console for client shape.");
  }

  return c as Connection;
}

/**
 * Send a transaction using Gill client methods (tries several common patterns).
 * Returns a signature string (or whatever the underlying method returns).
 */
export async function sendTx(client: any, tx: AnyTx) {
  const rpc = client?.rpc;

  // Most common Gill-ish patterns
  if (rpc?.sendAndConfirmTransaction) return rpc.sendAndConfirmTransaction(tx);
  if (rpc?.signAndSendTransaction) return rpc.signAndSendTransaction(tx);
  if (rpc?.sendTransaction) return rpc.sendTransaction(tx);

  // Some clients attach send methods at top-level
  if (client?.sendAndConfirmTransaction) return client.sendAndConfirmTransaction(tx);
  if (client?.signAndSendTransaction) return client.signAndSendTransaction(tx);
  if (client?.sendTransaction) return client.sendTransaction(tx);

  // eslint-disable-next-line no-console
  console.error("Gill client missing send method:", {
    clientKeys: Object.keys(client ?? {}),
    rpcKeys: Object.keys(rpc ?? {}),
  });

  throw new Error("Gill client: no known send method found (see console for keys).");
}
