import { RuleError } from '../core/rule-error'

/** Vereditos do catálogo, no mesmo formato dos outros domínios. */
export class NftRuleError extends RuleError {
  static nftNotFound(): NftRuleError {
    return new NftRuleError(404, 'NFT_NOT_FOUND', 'Este NFT não existe.')
  }

  static invalidPrice(): NftRuleError {
    return new NftRuleError(
      422,
      'INVALID_PRICE',
      'O preço deve ser um valor decimal positivo.',
    )
  }

  static invalidUnits(): NftRuleError {
    return new NftRuleError(
      422,
      'INVALID_UNITS',
      'A disponibilidade não pode ser negativa.',
    )
  }
}
