'use client'

import React, { useMemo } from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import { ReactQueryProvider } from './react-query-provider'
import { SolanaProvider } from '@/components/solana/solana-provider'

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'

import '@solana/wallet-adapter-react-ui/styles.css'

export function AppProviders({ children }: Readonly<{ children: React.ReactNode }>) {
  // Hardcode devnet for now so everything matches your wallet + program deploy.
  // Later, you can wire this to your existing cluster selector UI.
  const endpoint = useMemo(() => clusterApiUrl('devnet'), [])
  const wallets = useMemo(() => [new PhantomWalletAdapter()], [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <ReactQueryProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              <SolanaProvider>{children}</SolanaProvider>
            </ThemeProvider>
          </ReactQueryProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
