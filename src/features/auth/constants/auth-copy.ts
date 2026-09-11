export const AUTH_COPY = {
  loginTab: 'Entrar',
  /** O título do diálogo; as abas não servem de nome — viravam "Entrar Criar conta". */
  dialogTitle: 'Entrar ou criar conta',
  emailLabel: 'E-mail',
  passwordLabel: 'Senha',
  registerTab: 'Criar conta',
  /** Títulos das telas cheias do mobile, que são mais explícitos que as abas. */
  registerTitle: 'Criar perfil de colecionador',
  registerScreenSubmit: 'Criar perfil',
  newHere: 'Novo na Kurio?',
  createAccount: 'Crie uma conta',
  alreadyHaveAccount: 'Já tem uma conta?',
  close: 'Fechar',

  loginSubtitle:
    'Entre para gerenciar sua carteira, coleção e perfil de criador.',
  registerSubtitle:
    'Crie seu perfil de colecionador e conecte uma carteira quando quiser.',

  emailPlaceholder: 'contato@email.com',
  passwordPlaceholder: '**********',
  forgotPassword: 'Esqueceu a senha?',
  loginSubmit: 'Entrar',
  loginSubmitting: 'Entrando...',

  usernamePlaceholder: 'Nome de usuário',
  registerEmailPlaceholder: 'Digite seu e-mail',
  newPasswordPlaceholder: 'Senha',
  confirmPasswordPlaceholder: 'Confirmar senha',
  registerSubmit: 'Criar conta',
  registerSubmitting: 'Criando conta...',

  providersDivider: 'Ou continue com',
  google: 'Continuar com Google',
  facebook: 'Continuar com Facebook',

  /**
   * Provedor externo e recuperação de senha dependem de um servidor de
   * verdade — não há como fazê-los aqui sem simular uma autenticação que não
   * aconteceu. O aviso aparece no clique, em vez de o botão ficar inerte sem
   * explicação.
   */
  providerUnavailable:
    'Entrar com Google ou Facebook exige um provedor de identidade real. Nesta demonstração, use e-mail e senha.',
  forgotPasswordUnavailable:
    'A recuperação de senha depende de envio de e-mail, que não existe nesta demonstração.',

  /** Sem isso, quem abre o modal não tem como entrar na conta de exemplo. */
  demoHint: 'Demonstração: colecionador@kurio.art · kurio2026',

  logout: 'Sair',
  logoutPending: 'Saindo...',
  profile: 'Ir para Perfil',
  accountMenuLabel: 'Menu da conta',
} as const
