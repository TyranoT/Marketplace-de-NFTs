import { useState } from 'react'
import { X } from 'lucide-react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/global/components/ui/dialog'
import { AUTH_COPY } from '../constants/auth-copy'
import { AuthNotice } from '../components/auth-notice'
import { AuthProviders } from '../components/auth-providers'
import { AuthTabs } from '../components/auth-tabs'
import { LoginForm } from '../components/login-form'
import { RegisterForm } from '../components/register-form'
import type { AuthTab } from '../components/auth-tabs'

type AuthDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Card de 500 do frame, centrado, com a barra da marca no rodapé — a mesma
 * linguagem do modal de confirmação de pedido. As duas abas vivem num diálogo
 * só porque é isso que o desenho mostra: quem errou a aba troca sem perder o
 * contexto da página por trás.
 */
export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const [tab, setTab] = useState<AuthTab>('login')
  const [notice, setNotice] = useState<string>()

  function handleTabChange(next: AuthTab) {
    setTab(next)
    setNotice(undefined)
  }

  function handleAuthenticated() {
    setNotice(undefined)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-125 border-b-8 border-primary">
        <div className="relative flex flex-col gap-5 px-13 pt-8 pb-9">
          <DialogClose
            aria-label={AUTH_COPY.close}
            className="absolute top-4 right-4 text-brand transition-colors after:absolute after:-inset-2 hover:text-highlight"
          >
            <X className="size-6" />
          </DialogClose>

          <DialogTitle render={<div />} className="text-20">
            <AuthTabs active={tab} onChange={handleTabChange} />
          </DialogTitle>

          <DialogDescription className="text-center text-14 leading-5 text-brand-muted">
            {tab === 'login'
              ? AUTH_COPY.loginSubtitle
              : AUTH_COPY.registerSubtitle}
          </DialogDescription>

          <div
            role="tabpanel"
            id={`auth-panel-${tab}`}
            aria-labelledby={`auth-tab-${tab}`}
          >
            {tab === 'login' ? (
              <LoginForm
                onAuthenticated={handleAuthenticated}
                onUnavailable={setNotice}
              />
            ) : (
              <RegisterForm onAuthenticated={handleAuthenticated} />
            )}
          </div>

          <div className="flex flex-col gap-3 border-t border-line-soft pt-5">
            <p className="text-center text-14 leading-4 text-foreground">
              {AUTH_COPY.providersDivider}
            </p>

            <AuthProviders onUnavailable={setNotice} />

            <AuthNotice message={notice} tone="info" />

            {/** Sem esta linha, ninguém descobre como entrar na conta de exemplo. */}
            <p className="text-center text-12 leading-4 text-brand-muted">
              {AUTH_COPY.demoHint}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
