import { createContext, forwardRef, type HTMLAttributes, useCallback, useContext, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { clsx } from 'clsx'

type AccordionContextProps = {
	value: string[]
	onItemClick: (value: string) => void
}

const AccordionContext = createContext<AccordionContextProps | null>(null)

const useAccordion = () => {
	const context = useContext(AccordionContext)

	if (!context) {
		throw new Error('useAccordion must be used within an Accordion')
	}

	return context
}

type AccordionBaseProps = Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'>

type AccordionSingleProps = {
	type: 'single'
	value?: string
	defaultValue?: string
	collapsible?: boolean
	onValueChange?: (value: string | undefined) => void
}

type AccordionMultipleProps = {
	type?: 'multiple'
	value?: string[]
	defaultValue?: string[]
	onValueChange?: (value: string[]) => void
}

type AccordionProps = AccordionBaseProps & (AccordionSingleProps | AccordionMultipleProps)

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
	(props, ref) => {
		const {
			type = 'multiple',
			value: valueProp,
			defaultValue,
			onValueChange,
			children,
			className,
			...rest
		} = props as AccordionProps & { collapsible?: boolean }

		const collapsible = props.type === 'single' && props.collapsible

		const [internalValue, setInternalValue] = useState(defaultValue)
		const isControlled = valueProp !== undefined
		const value = isControlled ? valueProp : internalValue

		const onItemClick = useCallback(
			(itemValue: string) => {
				let newValue: string | string[] | undefined

				if (type === 'single') {
					const currentSingleValue = value as string | undefined
					newValue = currentSingleValue === itemValue && collapsible ? undefined : itemValue
					if (onValueChange) {
						(onValueChange as (v: string | undefined) => void)(newValue)
					}
				} else {
					const currentValues = (value as string[]) || []
					newValue = currentValues.includes(itemValue)
						? currentValues.filter((v) => v !== itemValue)
						: [...currentValues, itemValue]
					if (onValueChange) {
						(onValueChange as (v: string[]) => void)(newValue)
					}
				}

				if (!isControlled) {
					setInternalValue(newValue)
				}
			},
			[type, value, collapsible, isControlled, onValueChange]
		)

		const contextValue = {
			value: Array.isArray(value) ? value : (value ? [value] : []),
			onItemClick
		}

		return (
			<AccordionContext.Provider value={contextValue}>
				<div
					ref={ref}
					className={clsx('overflow-hidden rounded-lg border border-outline', className)}
					{...rest}
				>
					{children}
				</div>
			</AccordionContext.Provider>
		)
	}
)

type AccordionItemContextProps = {
	value: string
}

const AccordionItemContext = createContext<AccordionItemContextProps | null>(null)

const useAccordionItem = () => {
	const context = useContext(AccordionItemContext)

	if (!context) {
		throw new Error('useAccordionItem must be used within an AccordionItem')
	}

	return context
}

type AccordionItemProps = {
	value: string
} & HTMLAttributes<HTMLDivElement>

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
	({ children, className, value, ...props }, ref) => {
		return (
			<AccordionItemContext.Provider value={{ value }}>
				<div
					ref={ref}
					className={clsx('border-b last-of-type:border-b-0 border-outline', className)}
					{...props}
				>
					{children}
				</div>
			</AccordionItemContext.Provider>
		)
	}
)

export const AccordionTrigger = forwardRef<
	HTMLButtonElement,
	HTMLAttributes<HTMLButtonElement>
>(({ children, className, ...props }, ref) => {
	const { onItemClick, value: accordionValue } = useAccordion()
	const { value } = useAccordionItem()

	const isOpen = accordionValue.includes(value)

	return (
		<button
			ref={ref}
			className={clsx(
				'flex w-full items-center justify-between p-4 font-medium transition-all hover:bg-surface-variant [&[data-state=open]>svg]:rotate-180',
				className
			)}
			onClick={() => onItemClick(value)}
			{...props}
		>
			{children}
			<ChevronDown
				className={clsx(
					'h-4 w-4 shrink-0 transition-transform duration-150',
					isOpen && 'rotate-180'
				)}
			/>
		</button>
	)
})

export const AccordionContent = forwardRef<
	HTMLDivElement,
	HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
	const { value: accordionValue } = useAccordion()
	const { value } = useAccordionItem()

	const isOpen = accordionValue.includes(value)

	if (!isOpen) {
		return
	}

	return (
		<div
			ref={ref}
			className={clsx(
				'overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
				className
			)}
			{...props}
		>
			<div className="pb-4 pl-4 pr-4">{children}</div>
		</div>
	)
})

