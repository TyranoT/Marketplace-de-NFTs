import { withoutUndefined } from '../core/without-undefined'
import type { WalletRole, WalletSnapshot } from './user-snapshot'

export type WalletChanges = Partial<
  Omit<WalletSnapshot, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
>

export class MockWallet {
  private constructor(private readonly snapshot: WalletSnapshot) {}

  static fromSnapshot(snapshot: WalletSnapshot): MockWallet {
    return new MockWallet({ ...snapshot })
  }

  toSnapshot(): WalletSnapshot {
    return { ...this.snapshot }
  }

  get id(): string {
    return this.snapshot.id
  }

  get userId(): string {
    return this.snapshot.userId
  }

  get role(): WalletRole {
    return this.snapshot.role
  }

  get nickname(): string {
    return this.snapshot.nickname
  }

  get address(): string {
    return this.snapshot.address
  }

  applyChanges(changes: WalletChanges): void {
    Object.assign(this.snapshot, withoutUndefined(changes))

    this.snapshot.updatedAt = new Date().toISOString()
  }
}
