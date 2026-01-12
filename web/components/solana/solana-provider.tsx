'use client';

import dynamic from 'next/dynamic';
import { AnchorProvider } from '@coral-xyz/anchor';
import { WalletError } from '@solana/wallet-adapter-base';
import {
  AnchorWallet,
  useConnection,
  useWallet,
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { ReactNode, useCallback, useMemo } from 'react';

import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';

import '@solana/wallet-adapter-react-ui/styles.css';

export const WalletButton = dynamic(
  async () =>
    (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export function SolanaProvider({ children }: { children: ReactNode }) {
  const endpoint = 'https://api.devnet.solana.com';

  const onError = useCallback((error: WalletError) => {
    console.error(error);
  }, []);

  // IMPORTANT: you must provide at least one wallet adapter
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect={true}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export function useAnchorProvider() {
  const { connection } = useConnection();
  const wallet = useWallet();

  return new AnchorProvider(connection, wallet as AnchorWallet, {
    commitment: 'confirmed',
  });
}
