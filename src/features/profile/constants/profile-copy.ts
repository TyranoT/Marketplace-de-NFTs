export const PROFILE_COPY = {
  sidebarHeading: 'Meu perfil',
  logout: 'Sair',
  logoutPending: 'Saindo...',
  /** Cada item inerte é anunciado com o motivo, não só desabilitado. */
  itemUnavailable: 'em breve',

  dataHeading: 'Perfil do colecionador',
  displayNameLabel: 'Nome de exibição',
  usernameLabel: 'Nome de usuário',
  emailLabel: 'E-mail',
  ensLabel: 'Nome ENS',
  ensNamePlaceholder: 'seu-nome',
  walletNicknameLabel: 'Apelido da carteira',
  avatarLabel: 'Avatar',
  avatarChange: 'Alterar',
  avatarRemove: 'Remover',
  avatarAlt: 'Avatar do colecionador',
  passwordHeading: 'Alterar senha',
  currentPasswordLabel: 'Senha atual',
  newPasswordLabel: 'Nova senha',
  confirmPasswordLabel: 'Confirmar nova senha',
  save: 'Salvar',
  saving: 'Salvando...',
  saved: 'Perfil atualizado.',
  savedWithPassword: 'Perfil e senha atualizados.',
  /** O perfil já foi salvo quando a senha falha: dizer isso evita salvar duas vezes. */
  savedButPasswordFailed:
    'Seus dados foram salvos, mas a senha não foi alterada.',

  walletsHeading: 'Carteira principal',
  walletsSubtitle:
    'Estas carteiras ficam disponíveis no pagamento e para receber NFTs comprados.',
  walletsAdd: 'Adicionar',
  walletSave: 'Salvar carteira',
  walletSaving: 'Salvando...',
  walletSaved: 'Carteira salva.',
  walletRemoved: 'Carteira removida.',
  nicknameLabel: 'Apelido da carteira',
  networkLabel: 'Rede',
  networkPlaceholder: 'Selecione uma rede',
  profileNameLabel: 'Nome do perfil',
  addressLabel: 'Endereço da carteira',
  addressPlaceholder: 'Endereço 0x da carteira',
  secondaryAddressLabel: 'Carteira secundária',
  secondaryAddressPlaceholder: 'ENS ou carteira secundária (opcional)',
  walletTypeLabel: 'Tipo de carteira',
  walletTypePlaceholder: 'Selecione uma carteira',
  referralCodeLabel: 'Código de indicação',

  secondaryHeading: 'Carteira secundária',
  secondaryEmpty: 'Você ainda não adicionou uma carteira secundária.',
  sameAsPrimary: 'Igual à carteira principal',
  secondaryEdit: 'Editar',
  secondaryRemove: 'Remover',
  newSecondaryHeading: 'Nova carteira',
  cancel: 'Cancelar',
  /** Sem principal não há para onde mandar o NFT: o primeiro cadastro é ela. */
  primaryMissing:
    'Cadastre sua carteira principal — é para ela que os NFTs comprados vão.',

  authRequiredTitle: 'Entre para ver seu perfil',
  authRequiredBody:
    'Seus dados, carteiras e histórico ficam na sua conta. Entre para gerenciá-los.',
  authRequiredCta: 'Entrar',

  loadingLabel: 'Carregando perfil',
} as const

export function buildRemoveWalletLabel(nickname: string) {
  return `Remover a carteira ${nickname}`
}

export function buildUnavailableLabel(label: string) {
  return `${label} — ${PROFILE_COPY.itemUnavailable}`
}
