import * as React from 'react'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from 'lucide-react'
import { cn } from '@/global/helpers/cn'
import { buttonVariants } from '@/global/components/ui/button'

/** `<nav>` já é landmark de navegação; `role="navigation"` era redundante. */
function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      aria-label="Paginação"
      data-slot="pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn('flex items-center gap-2', className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<'li'>) {
  return <li data-slot="pagination-item" {...props} />
}

function linkClass(isActive: boolean | undefined, className?: string) {
  return cn(
    buttonVariants({ variant: isActive ? 'default' : 'outline', size: 'icon' }),
    'rounded-[4px] text-18 leading-4',
    className,
  )
}

type PaginationLinkProps = {
  /**
   * O link a renderizar — em geral o `<Link to search />` do router. Quem
   * monta é a tela, porque só ela conhece a rota e consegue tipar o
   * `search`; o primitivo aplica a aparência e a semântica.
   */
  render: React.ReactElement<Record<string, unknown>>
  isActive?: boolean
  className?: string
  children?: React.ReactNode
  'aria-label'?: string
}

/**
 * Link de verdade, e não botão fingindo ser link.
 *
 * Antes era o `Button` do Base UI com `nativeButton={false}` sobre um
 * `<a href="#">`: o Base UI injeta `role="button"` nesse modo, o leitor de
 * tela anunciava "botão 2", e não dava para abrir a página em outra aba nem
 * copiar o endereço — num catálogo cuja página já vive na URL.
 */
function PaginationLink({
  render,
  isActive,
  className,
  children,
  'aria-label': ariaLabel,
}: PaginationLinkProps) {
  return React.cloneElement(render, {
    'aria-current': isActive ? 'page' : undefined,
    'aria-label': ariaLabel,
    'data-slot': 'pagination-link',
    'data-active': isActive,
    className: linkClass(isActive, className),
    children,
  })
}

type PaginationStepProps = Omit<PaginationLinkProps, 'children'> & {
  /** Na primeira ou na última página não há para onde ir. */
  disabled?: boolean
}

/**
 * Desabilitado vira texto, e não link com `aria-disabled`: um link com
 * `href` continua navegável, e anunciar "próxima página" onde não existe
 * próxima página é prometer o que não há.
 */
function PaginationStep({
  disabled,
  label,
  icon,
  className,
  render,
}: PaginationStepProps & { label: string; icon: React.ReactNode }) {
  if (disabled) {
    return (
      <span
        aria-disabled="true"
        className={cn(linkClass(false, className), 'opacity-50')}
      >
        {icon}
        <span className="sr-only">{label}</span>
      </span>
    )
  }

  return (
    <PaginationLink render={render} aria-label={label} className={className}>
      {icon}
    </PaginationLink>
  )
}

function PaginationPrevious(props: PaginationStepProps) {
  return (
    <PaginationStep
      label="Ir para a página anterior"
      icon={<ChevronLeftIcon />}
      {...props}
    />
  )
}

function PaginationNext(props: PaginationStepProps) {
  return (
    <PaginationStep
      label="Ir para a próxima página"
      icon={<ChevronRightIcon />}
      {...props}
    />
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        "flex size-8.75 items-center justify-center [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <MoreHorizontalIcon />
      <span className="sr-only">Mais páginas</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
