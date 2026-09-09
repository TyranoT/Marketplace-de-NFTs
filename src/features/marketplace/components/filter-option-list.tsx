import { cn } from 'cn'
import { Checkbox } from '@/global/components/ui/checkbox'
import { Label } from '@/global/components/ui/label'
import type { FilterOption } from '../type'

type FilterOptionListProps = {
  name: string
  options: Array<FilterOption>
  selected: Array<string>
  onToggle: (id: string) => void
}

export function FilterOptionList({
  name,
  options,
  selected,
  onToggle,
}: FilterOptionListProps) {
  return (
    <ul className="flex w-full flex-col px-3">
      {options.map(({ id, label, count }) => {
        const isSelected = selected.includes(id)
        const inputId = `${name}-${id}`

        return (
          <li
            key={id}
            className={cn(
              'flex h-10 items-center justify-between gap-2 text-15',
              isSelected ? 'text-highlight' : 'text-text-secondary',
            )}
          >
            <div className="flex items-center gap-2">
              <Checkbox
                id={inputId}
                checked={isSelected}
                onCheckedChange={() => onToggle(id)}
                className="size-3.75"
              />
              <Label
                htmlFor={inputId}
                className={cn(
                  'cursor-pointer text-15 whitespace-nowrap',
                  isSelected ? 'font-bold' : 'font-normal',
                )}
              >
                {label}
              </Label>
            </div>
            <span className="text-15 font-bold">({count})</span>
          </li>
        )
      })}
    </ul>
  )
}
