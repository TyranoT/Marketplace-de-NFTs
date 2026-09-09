import { cn } from '@/global/helpers/cn'

type ContainerProps = React.ComponentProps<'div'> & {
  as?: 'div' | 'header' | 'footer' | 'main' | 'section' | 'nav'
}

export function Container({
  as: Tag = 'div',
  className,
  ...props
}: ContainerProps) {
  return (
    <Tag
      className={cn('mx-auto w-full max-w-312 px-6', className)}
      {...props}
    />
  )
}
