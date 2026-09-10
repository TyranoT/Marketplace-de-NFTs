export const userKeys = {
  all: ['user'] as const,
  me: () => [...userKeys.all, 'me'] as const,
  wallets: () => [...userKeys.all, 'wallets'] as const,
}
