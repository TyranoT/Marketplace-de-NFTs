import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight, EyeOff } from 'lucide-react'
import { GoogleIcon } from '@/global/components/icons'
import { NftCard, NftCardSkeleton } from '@/features/marketplace'
import { Button } from '@/global/components/ui/button'
import { Input } from '@/global/components/ui/input'
import { Label } from '@/global/components/ui/label'
import { FormField, fieldProps } from '@/global/components/ui/form-field'
import { OptionSelect } from '@/global/components/ui/option-select'
import { PasswordInput } from '@/global/components/ui/password-input'
import { Textarea } from '@/global/components/ui/textarea'
import { Radio, RadioGroup } from '@/global/components/ui/radio-group'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/global/components/ui/dropdown-menu'
import { NETWORKS } from '@/global/data'

export const Route = createFileRoute('/ui')({
  component: UiShowcase,
  staticData: { header: { active: 'home', divider: true } },
})

const ARTWORK =
  'https://www.figma.com/api/mcp/asset/8d86e38f-6c1b-481b-af3b-36af455f2735.png'

function Section({
  title,
  spec,
  children,
}: {
  title: string
  spec: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-4 border-t border-line pt-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-16 leading-4 font-bold text-text-primary">
          {title}
        </h2>
        <p className="text-12 text-text-secondary">{spec}</p>
      </div>
      {children}
    </section>
  )
}

function UiShowcase() {
  return (
    <main className="mx-auto flex max-w-300 flex-col gap-10 px-6 py-12">
      <header className="flex flex-col gap-2">
        <h1 className="text-24 font-bold text-text-primary">Primitivos</h1>
        <p className="text-14 leading-6 text-text-secondary">
          Referência dos componentes shadcn/ui adaptados aos tokens do Figma.
        </p>
      </header>

      <Section
        title="CTA primário"
        spec="140×40 · radius 6 · texto 14 medium lh 20 · ícone 18"
      >
        <div className="flex flex-wrap items-center gap-4">
          <Button className="w-35">
            Explorar
            <ArrowRight />
          </Button>
          <Button variant="secondary">Secundário</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button disabled>Desabilitado</Button>
          <Button size="icon" variant="outline" aria-label="Próxima página">
            <ArrowRight />
          </Button>
        </div>
      </Section>

      <Section
        title="Social Button"
        spec="fill width · 40 alto · radius 5 · texto 13 medium · ícone 20"
      >
        <div className="w-85">
          <Button variant="social">
            <GoogleIcon />
            Continuar com Google
          </Button>
        </div>
      </Section>

      <Section title="Input" spec="40 alto · radius 3 · px 16 · borda #3F2319">
        <div className="flex w-104.25 flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" placeholder="voce@exemplo.com" />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="senha">Senha</Label>
            <div className="relative">
              <Input id="senha" type="password" className="pr-12" />
              <button
                type="button"
                aria-label="Mostrar senha"
                className="absolute inset-y-0 right-4 flex items-center text-brand-muted"
              >
                <EyeOff className="size-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="invalido">Com erro</Label>
            <Input id="invalido" aria-invalid defaultValue="valor inválido" />
          </div>
        </div>
      </Section>

      <Section
        title="Campo de formulário"
        spec="rótulo 15 · asterisco em --destructive · erro 12 ligado por aria-describedby"
      >
        <div className="grid w-104.25 gap-5">
          <FormField id="vitrine-nome" label="Nome de exibição" required>
            <Input {...fieldProps('vitrine-nome')} />
          </FormField>

          <FormField
            id="vitrine-erro"
            label="Endereço da carteira"
            required
            error="O endereço começa com 0x — o prefixo vem na frente."
          >
            <Input
              {...fieldProps('vitrine-erro', 'erro')}
              defaultValue="00000x"
            />
          </FormField>
        </div>
      </Section>

      <Section
        title="Select de opções"
        spec="40 alto · placeholder em --text-secondary"
      >
        <div className="w-104.25">
          <OptionSelect
            id="vitrine-rede"
            value=""
            options={NETWORKS}
            placeholder="Selecione uma rede"
            onValueChange={() => undefined}
          />
        </div>
      </Section>

      <Section
        title="Senha"
        spec="olho com tabIndex -1 · alterna type entre password e text"
      >
        <div className="w-104.25">
          <PasswordInput
            id="vitrine-senha"
            defaultValue="kurio2026"
            aria-label="Senha"
          />
        </div>
      </Section>

      <Section title="Textarea" spec="radius 3 · px 16 py 12 · texto 14 lh 20">
        <div className="w-104.25">
          <Textarea rows={4} placeholder="Observação do colecionador" />
        </div>
      </Section>

      <Section title="Radio" spec="16 · indicador 8 em --brand">
        <RadioGroup defaultValue="metamask" className="flex-row gap-6">
          {['MetaMask', 'Coinbase'].map((label) => (
            <label
              key={label}
              className="flex items-center gap-3 text-15 text-foreground"
            >
              <Radio value={label.toLowerCase()} />
              {label}
            </label>
          ))}
        </RadioGroup>
      </Section>

      <Section
        title="Menu"
        spec="card --surface-card · borda --line · item destacado em --muted"
      >
        <DropdownMenu>
          <DropdownMenuTrigger className="flex h-10 items-center gap-2 rounded-md border border-line bg-card px-4 text-14 text-foreground">
            Abrir menu
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Meu perfil</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-brand">Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Section>

      <Section
        title="Card de NFT"
        spec="258×356 · placa 258×300 · arte 250×250 radius 15 · gap 12"
      >
        <div className="grid grid-cols-[repeat(3,258px)] gap-8.5">
          <NftCard
            name="Emerald Ape #042"
            price="1.19 ETH"
            imageUrl={ARTWORK}
          />
          <NftCard
            name="Neon Vessel #552"
            price="1.99 ETH"
            secondaryPrice="2.29 ETH"
            imageUrl={ARTWORK}
          />
          <NftCardSkeleton />
        </div>
      </Section>

      <Section
        title="Ícones"
        spec="Lucide com stroke 1.5 + marca Google exportada do Figma"
      >
        <div className="flex items-center gap-8 text-text-primary">
          <div className="flex flex-col items-center gap-2">
            <ArrowRight className="size-4.5" />
            <span className="text-10 text-text-secondary">ArrowRight 18</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <EyeOff className="size-5" />
            <span className="text-10 text-text-secondary">EyeOff 20</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <GoogleIcon className="size-5" />
            <span className="text-10 text-text-secondary">google 20</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <GoogleIcon className="size-16" />
            <span className="text-10 text-text-secondary">google 64</span>
          </div>
        </div>
      </Section>
    </main>
  )
}
