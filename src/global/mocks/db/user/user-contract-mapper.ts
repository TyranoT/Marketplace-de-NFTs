import type { MockUser } from './mock-user'
import type { MockWallet } from './mock-wallet'
import type { User, Wallet } from '../../../api/contracts/user'

/**
 * Única classe que monta o formato de saída — e é por isso que ela é o lugar
 * onde se garante que nada de senha atravesse a rede: `MockUser` não expõe
 * digesto nem sal, então aqui não há o que vazar.
 */
export class UserContractMapper {
  toContract(user: MockUser, primaryWallet?: MockWallet): User {
    return {
      id: user.id,
      displayName: user.displayName,
      username: user.username,
      email: user.email,
      ensName: user.ensName,
      ensSuffix: user.ensSuffix,
      avatarUrl: user.avatarUrl,
      primaryWalletNickname: primaryWallet?.nickname,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }

  toWalletContract(wallet: MockWallet): Wallet {
    const snapshot = wallet.toSnapshot()

    return {
      id: snapshot.id,
      role: snapshot.role,
      nickname: snapshot.nickname,
      displayName: snapshot.displayName,
      network: snapshot.network,
      profileName: snapshot.profileName,
      address: snapshot.address,
      secondaryAddress: snapshot.secondaryAddress,
      walletType: snapshot.walletType,
      referralCode: snapshot.referralCode,
      email: snapshot.email,
      ensName: snapshot.ensName,
      ensSuffix: snapshot.ensSuffix,
      createdAt: snapshot.createdAt,
      updatedAt: snapshot.updatedAt,
    }
  }
}

export const userContractMapper = new UserContractMapper()
