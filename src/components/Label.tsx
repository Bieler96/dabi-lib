"use client";

import * as React from "react";
import { cn } from "../utils/cn";

function Label({ className, ...props }: React.ComponentProps<"label">) {
	return (
		<label
			data-slot="label"
			className={cn(
				"flex min-w-0 max-w-full items-center gap-2 text-sm leading-snug font-medium text-wrap break-words select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
				className,
			)}
			{...props}
		/>
	);
}

export { Label };
