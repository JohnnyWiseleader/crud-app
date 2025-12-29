import { useSolana } from '@/components/solana/use-solana'
import { WalletDropdown } from '@/components/wallet-dropdown'
import { AppHero } from '@/components/app-hero'
import { CrudappUiProgramExplorerLink } from './ui/crudapp-ui-program-explorer-link'
import { CrudappUiCreate } from './ui/crudapp-ui-create'
import { CrudappUiProgram } from '@/features/crudapp/ui/crudapp-ui-program'

export default function CrudappFeature() {
  const { account } = useSolana()

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
    <div>
      <AppHero title="Crudapp" subtitle={'Run the program by clicking the "Run program" button.'}>
        <p className="mb-6">
          <CrudappUiProgramExplorerLink />
        </p>
        <CrudappUiCreate account={account} />
      </AppHero>
      <CrudappUiProgram />
    </div>
  )
}
