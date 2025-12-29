import { CRUDAPP_PROGRAM_ADDRESS } from '@project/anchor'
import { AppExplorerLink } from '@/components/app-explorer-link'
import { ellipsify } from '@wallet-ui/react'

export function CrudappUiProgramExplorerLink() {
  return <AppExplorerLink address={CRUDAPP_PROGRAM_ADDRESS} label={ellipsify(CRUDAPP_PROGRAM_ADDRESS)} />
}
