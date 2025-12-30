import clsx from "clsx"
import { Loader2Icon } from "lucide-react"

export function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
    return (
        <Loader2Icon
            role="status"
            aria-label="Loading"
            className={clsx("size-4 animate-spin", className)}
            {...props}
        />
    )
}