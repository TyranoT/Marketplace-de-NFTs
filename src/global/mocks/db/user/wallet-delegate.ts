import { ModelDelegate } from '../core/model-delegate'
import { MockWallet } from './mock-wallet'
import type { WritableDelegate } from '../core/model-delegate'
import type { MockDbStore } from '../core/mock-db-store'
import type { WalletChanges } from './mock-wallet'
import type { WalletRole, WalletSnapshot } from './user-snapshot'

export type WalletWhere = {
  id?: string
  userId?: string
  role?: WalletRole
  address?: string
}

export type WalletWhereUnique = {
  id: string
}

export class WalletDelegate
  extends ModelDelegate<MockWallet, WalletWhere>
  implements
    WritableDelegate<
      MockWallet,
      WalletWhereUnique,
      WalletSnapshot,
      WalletChanges
    >
{
  constructor(private readonly store: MockDbStore) {
    super()
  }

  create(args: { data: WalletSnapshot }): MockWallet {
    const wallet = MockWallet.fromSnapshot(args.data)

    this.store.load().wallets.set(wallet.id, wallet)

    return wallet
  }

  update(args: { where: WalletWhereUnique; data: WalletChanges }): MockWallet {
    const wallet = this.require(args.where)

    wallet.applyChanges(args.data)

    return wallet
  }

  delete(args: { where: WalletWhereUnique }): MockWallet {
    const wallet = this.require(args.where)

    this.store.load().wallets.delete(wallet.id)

    return wallet
  }

  protected list(): Array<MockWallet> {
    return [...this.store.load().wallets.values()]
  }

  /** Endereço compara sem caixa: `0xAB…` e `0xab…` são a mesma carteira. */
  protected matches(wallet: MockWallet, where: WalletWhere): boolean {
    return (
      (!where.id || wallet.id === where.id) &&
      (!where.userId || wallet.userId === where.userId) &&
      (!where.role || wallet.role === where.role) &&
      (!where.address ||
        wallet.address.toLowerCase() === where.address.trim().toLowerCase())
    )
  }

  private require(where: WalletWhereUnique): MockWallet {
    const wallet = this.findUnique({ where })

    if (!wallet) throw new Error(`Carteira ${where.id} não existe.`)

    return wallet
  }
}
