import { cn } from "shared/lib"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-md bg-slate-300 dark:bg-slate-700", className)}
      {...props}
    />
  )
}

export { Skeleton }
