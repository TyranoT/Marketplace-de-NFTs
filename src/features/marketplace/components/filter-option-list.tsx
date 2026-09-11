import { cn } from '@/global/helpers/cn'
import { Checkbox } from '@/global/components/ui/checkbox'
import { Label } from '@/global/components/ui/label'
import type { FilterOption } from '../type'

type FilterOptionListProps = {
  name: string
  /** O `<h2>` da seção: é ele que nomeia o grupo de caixas. */
  labelledBy: string
  /**
   * Prefixo único dos ids. Os filtros aparecem duas vezes na mesma página —
   * na lateral do desktop e no diálogo do mobile —, e ids fixos faziam os
   * rótulos de uma cópia apontarem para as caixas da outra.
   */
  idPrefix: string
  options: Array<FilterOption>
  selected: Array<string>
  onToggle: (id: string) => void
}

export function FilterOptionList({
  name,
  labelledBy,
  idPrefix,
  options,
  selected,
  onToggle,
}: FilterOptionListProps) {
  return (
    /**
     * O grupo fica num `div` em volta da lista, e não no próprio `<ul>`:
     * `role="group"` no `<ul>` substitui a semântica de lista, e os `<li>`
     * ficavam órfãos — o axe acusava.
     */
    <div role="group" aria-labelledby={labelledBy} className="w-full">
      <ul className="flex w-full flex-col px-3">
        {options.map(({ id, label, count }) => {
          const isSelected = selected.includes(id)
          const inputId = `${idPrefix}-${name}-${id}`
          const labelId = `${inputId}-label`

          return (
            <li
              key={id}
              className={cn(
                'flex h-10 items-center justify-between gap-2 text-15',
                isSelected ? 'text-highlight' : 'text-text-secondary',
              )}
            >
              <div className="flex items-center gap-2">
                {/**
                 * `aria-labelledby` explícito: o Base UI aplica o `id` ao input
                 * oculto e gera outro para o `role="checkbox"`, e o `htmlFor`
                 * do rótulo não chegava a ele — as caixas ficavam sem nome.
                 */}
                <Checkbox
                  id={inputId}
                  aria-labelledby={labelId}
                  checked={isSelected}
                  onCheckedChange={() => onToggle(id)}
                  className="size-3.75"
                />
                <Label
                  id={labelId}
                  htmlFor={inputId}
                  className={cn(
                    'cursor-pointer text-15 whitespace-nowrap',
                    isSelected ? 'font-bold' : 'font-normal',
                  )}
                >
                  {label}
                </Label>
              </div>
              {/**
               * Contagem ilustrativa, do Figma — não corresponde ao catálogo
               * simulado. Por isso não entra no nome da opção: anunciaria a
               * quem usa leitor de tela um número que a grade desmente.
               */}
              <span aria-hidden="true" className="text-15 font-bold">
                ({count})
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
