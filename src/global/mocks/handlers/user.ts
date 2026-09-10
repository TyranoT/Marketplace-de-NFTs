import { HttpResponse, http } from 'msw'
import { RuleError, userService, walletService } from '../db'
import { applyLatency, nextRequestIndex } from '../scenario/delay'
import { errorResponse, maybeFail } from '../scenario/failure'
import type {
  AvatarInput,
  ChangePasswordInput,
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
  WalletInput,
} from '../../api/contracts/user'

/**
 * Como nos outros handlers: só tradução de HTTP. Sessão, validação de perfil
 * e regras de carteira são do `UserService` e do `WalletService`.
 */
async function withScenario<TData>(run: () => TData, status = 200) {
  const index = nextRequestIndex()
  await applyLatency(index)

  const failure = maybeFail()

  if (failure) return failure

  try {
    const data = run()

    return data === undefined
      ? new HttpResponse(null, { status: 204 })
      : HttpResponse.json(data, { status })
  } catch (error) {
    if (error instanceof RuleError) {
      return errorResponse(error.status, error.code, error.message)
    }

    throw error
  }
}

export const userHandlers = [
  http.post('/api/session', async ({ request }) => {
    const body = (await request.json()) as LoginInput

    return withScenario(() => userService.login(body.email, body.password), 201)
  }),

  http.delete('/api/session', () =>
    withScenario(() => {
      userService.logout()
    }),
  ),

  http.post('/api/users', async ({ request }) => {
    const body = (await request.json()) as RegisterInput

    return withScenario(() => userService.register(body), 201)
  }),

  http.get('/api/me', () => withScenario(() => userService.me())),

  http.patch('/api/me', async ({ request }) => {
    const body = (await request.json()) as UpdateProfileInput

    return withScenario(() => userService.updateProfile(body))
  }),

  http.patch('/api/me/password', async ({ request }) => {
    const body = (await request.json()) as ChangePasswordInput

    return withScenario(() => userService.changePassword(body))
  }),

  http.patch('/api/me/avatar', async ({ request }) => {
    const body = (await request.json()) as AvatarInput

    return withScenario(() => userService.setAvatar(body.avatarUrl))
  }),

  http.get('/api/me/wallets', () => withScenario(() => walletService.list())),

  http.post('/api/me/wallets', async ({ request }) => {
    const body = (await request.json()) as WalletInput

    return withScenario(() => walletService.create(body), 201)
  }),

  http.patch('/api/me/wallets/:walletId', async ({ request, params }) => {
    const body = (await request.json()) as WalletInput

    return withScenario(() =>
      walletService.update(String(params.walletId), body),
    )
  }),

  http.delete('/api/me/wallets/:walletId', ({ params }) =>
    withScenario(() => walletService.delete(String(params.walletId))),
  ),
]
