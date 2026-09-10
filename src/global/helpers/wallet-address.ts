const WALLET_ADDRESS = /^0x[a-fA-F0-9]{40}$/

/**
 * Endereço de carteira EVM: `0x` seguido de 40 caracteres hexadecimais. A
 * regra vive aqui porque três camadas a aplicam — o formulário, o serviço de
 * compra e o de carteiras — e uma cópia divergente aceitaria no cliente o que
 * o servidor recusa.
 */
export function isWalletAddress(value: string): boolean {
  return WALLET_ADDRESS.test(value.trim())
}
