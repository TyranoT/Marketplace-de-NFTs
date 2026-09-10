import { Menu as MenuPrimitive } from '@base-ui/react/menu'
import { cn } from '@/global/helpers/cn'

const DropdownMenu = MenuPrimitive.Root
const DropdownMenuTrigger = MenuPrimitive.Trigger

function DropdownMenuContent({
  className,
  children,
  side = 'bottom',
  sideOffset = 8,
  align = 'end',
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<MenuPrimitive.Positioner.Props, 'side' | 'sideOffset' | 'align'>) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        className="isolate z-50"
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          className={cn(
            'min-w-(--anchor-width) origin-(--transform-origin) rounded-md border border-line bg-card p-1 text-card-foreground shadow-lg transition-all duration-150 data-open:scale-100 data-open:opacity-100 data-closed:scale-95 data-closed:opacity-0',
            className,
          )}
          {...props}
        >
          {children}
        </MenuPrimitive.Popup>
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

function DropdownMenuItem({ className, ...props }: MenuPrimitive.Item.Props) {
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-14 leading-5 text-foreground outline-none select-none data-highlighted:bg-muted data-highlighted:text-text-primary data-disabled:cursor-not-allowed data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn('-mx-1 my-1 h-px bg-line', className)}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
}
