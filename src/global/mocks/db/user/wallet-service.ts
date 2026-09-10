import { ENS_SUFFIXES, NETWORKS, WALLET_TYPES } from '../../../data'
import { isWalletAddress } from '../../../helpers/wallet-address'
import { mockDb } from '../core'
import { requireUser } from './session-guard'
import { userContractMapper } from './user-contract-mapper'
import { UserRuleError } from './user-rule-error'
import type { MockWallet } from './mock-wallet'
import type { WalletSnapshot } from './user-snapshot'
import type { Wallet, WalletInput } from '../../../api/contracts/user'

/** As carteiras que ficam disponíveis no pagamento e para receber os NFTs. */
export class WalletService {
  list(): Array<Wallet> {
    const user = requireUser()

    return mockDb.wallet
      .findMany({ where: { userId: user.id } })
      .map((wallet) => userContractMapper.toWalletContract(wallet))
  }

  create(input: WalletInput): Wallet {
    return mockDb.$transaction(() => {
      const user = requireUser()

      this.assertInput(input)
      this.assertAddressIsFree(input.address, user.id)

      if (input.role === 'primary' && this.primaryOf(user.id)) {
        throw UserRuleError.primaryWalletExists()
      }

      const now = new Date().toISOString()
      const created = mockDb.wallet.create({
        data: {
          ...toSnapshotFields(input),
          id: `wallet-${input.role}-${mockDb.wallet.count() + 1}`,
          userId: user.id,
          createdAt: now,
          updatedAt: now,
        },
      })

      return userContractMapper.toWalletContract(created)
    })
  }

  update(walletId: string, input: WalletInput): Wallet {
    return mockDb.$transaction(() => {
      const user = requireUser()
      const wallet = this.require(walletId, user.id)

      this.assertInput(input)
      this.assertAddressIsFree(input.address, user.id, wallet.id)

      const updated = mockDb.wallet.update({
        where: { id: wallet.id },
        /** O papel não muda por edição: promover carteira é outra operação. */
        data: { ...toSnapshotFields(input), role: wallet.role },
      })

      return userContractMapper.toWalletContract(updated)
    })
  }

  delete(walletId: string): Wallet {
    return mockDb.$transaction(() => {
      const user = requireUser()
      const wallet = this.require(walletId, user.id)

      /**
       * Sem carteira principal não há para onde mandar o NFT comprado. A
       * secundária sai livremente; a principal só seria removível junto com a
       * conta.
       */
      if (wallet.role === 'primary') {
        throw UserRuleError.primaryWalletRequired()
      }

      const removed = mockDb.wallet.delete({ where: { id: wallet.id } })

      return userContractMapper.toWalletContract(removed)
    })
  }

  private assertInput(input: WalletInput): void {
    const required = [
      ['Apelido da carteira', input.nickname],
      ['Nome de exibição', input.displayName],
      ['Nome do perfil', input.profileName],
      ['Código de indicação', input.referralCode],
      ['Nome ENS', input.ensName],
    ] as const

    for (const [label, value] of required) {
      if (!value.trim()) {
        throw UserRuleError.walletInvalid(label, 'campo obrigatório')
      }
    }

    if (!isWalletAddress(input.address)) {
      throw UserRuleError.walletInvalid(
        'Endereço da carteira',
        'use 0x seguido de 40 caracteres hexadecimais',
      )
    }

    if (!NETWORKS.some(({ id }) => id === input.network)) {
      throw UserRuleError.walletInvalid('Rede', 'rede não suportada')
    }

    if (!WALLET_TYPES.some(({ id }) => id === input.walletType)) {
      throw UserRuleError.walletInvalid(
        'Tipo de carteira',
        'carteira não suportada',
      )
    }

    if (!ENS_SUFFIXES.some(({ id }) => id === input.ensSuffix)) {
      throw UserRuleError.walletInvalid('Nome ENS', 'sufixo inválido')
    }
  }

  private assertAddressIsFree(
    address: string,
    userId: string,
    ignoringWalletId?: string,
  ): void {
    const existing = mockDb.wallet.findFirst({ where: { userId, address } })

    if (existing && existing.id !== ignoringWalletId) {
      throw UserRuleError.walletAddressTaken()
    }
  }

  private primaryOf(userId: string): MockWallet | null {
    return mockDb.wallet.findFirst({ where: { userId, role: 'primary' } })
  }

  private require(walletId: string, userId: string): MockWallet {
    const wallet = mockDb.wallet.findUnique({ where: { id: walletId } })

    /** Carteira de outro dono é indistinguível de inexistente, de propósito. */
    if (!wallet || wallet.userId !== userId) {
      throw UserRuleError.walletNotFound()
    }

    return wallet
  }
}

type SnapshotFields = Omit<
  WalletSnapshot,
  'id' | 'userId' | 'createdAt' | 'updatedAt'
>

function toSnapshotFields(input: WalletInput): SnapshotFields {
  return {
    role: input.role,
    nickname: input.nickname.trim(),
    displayName: input.displayName.trim(),
    network: input.network,
    profileName: input.profileName.trim(),
    address: input.address.trim(),
    secondaryAddress: input.secondaryAddress?.trim() || undefined,
    walletType: input.walletType,
    referralCode: input.referralCode.trim(),
    email: input.email.trim(),
    ensName: input.ensName.trim(),
    ensSuffix: input.ensSuffix,
  }
}

export const walletService = new WalletService()
