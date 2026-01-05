'use client'

import { useEffect } from 'react'
import { useSolana } from '@/components/solana/use-solana'
import { WalletDropdown } from '@/components/wallet-dropdown'
import { AppHero } from '@/components/app-hero'
import { CrudappUiCreate } from './ui/crudapp-ui-create'

export default function CrudappFeature() {
  const sol = useSolana()
  const { account } = sol

  useEffect(() => {
    console.log('useSolana()', sol)
    console.log('account', account)
    console.log('account.address', account?.address)
    console.log('connected', sol.connected)
    console.log('cluster', sol.cluster)
    console.log('wallet', sol.wallet)
    console.log('wallets', sol.wallets)
  }, [account, sol])

  if (!account) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="hero py-[64px]">
          <div className="hero-content text-center">
            <WalletDropdown />
          </div>
        </div>
      </div>
    )
  }

  return (
    <AppHero title="Crudapp" subtitle={'Run the program by clicking the "Run program" button.'}>
      <CrudappUiCreate />
    </AppHero>
  )
}
