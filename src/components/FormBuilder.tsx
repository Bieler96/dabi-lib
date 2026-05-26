import * as React from "react";
import { cn } from "../utils/cn";
import { Button } from "./Button";
import { Checkbox } from "./Checkbox";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "./Field";
import { Input } from "./Input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./Select";
import { Textarea } from "./Textarea";

type FormBuilderOptionValue = string | number | boolean;
type FormBuilderValue = string | number | boolean | FormBuilderOptionValue[];
type FormBuilderValues = Record<string, FormBuilderValue>;
type FormBuilderErrors<TValues extends FormBuilderValues> = Partial<
	Record<keyof TValues, string>
>;
type FormBuilderSelectOption = {
	value: FormBuilderOptionValue;
	label: string;
	disabled?: boolean;
};

type FormBuilderFieldContext<TValues extends FormBuilderValues> = {
	field: FormBuilderField<TValues>;
	value: FormBuilderValue;
	values: TValues;
	error?: string;
	setValue: (value: FormBuilderValue) => void;
	setValues: React.Dispatch<React.SetStateAction<TValues>>;
};

type FormBuilderBaseField<TValues extends FormBuilderValues> = {
	name: keyof TValues & string;
	label?: React.ReactNode;
	description?: React.ReactNode;
	required?: boolean;
	disabled?: boolean;
	defaultValue?: FormBuilderValue;
	className?: string;
	validate?: (
		value: FormBuilderValue,
		values: TValues,
	) => string | undefined | null;
};

type FormBuilderInputField<TValues extends FormBuilderValues> =
	FormBuilderBaseField<TValues> & {
		type?:
			| "text"
			| "email"
			| "password"
			| "search"
			| "tel"
			| "url"
			| "date"
			| "time"
			| "datetime-local"
			| "month"
			| "week"
			| "color";
		placeholder?: string;
		inputProps?: Omit<
			React.ComponentProps<typeof Input>,
			"name" | "value" | "defaultValue" | "type" | "onChange"
		>;
	};

type FormBuilderNumberField<TValues extends FormBuilderValues> =
	FormBuilderBaseField<TValues> & {
		type: "number";
		placeholder?: string;
		valueAsNumber?: boolean;
		inputProps?: Omit<
			React.ComponentProps<typeof Input>,
			"name" | "value" | "defaultValue" | "type" | "onChange"
		>;
	};

type FormBuilderTextareaField<TValues extends FormBuilderValues> =
	FormBuilderBaseField<TValues> & {
		type: "textarea";
		placeholder?: string;
		textareaProps?: Omit<
			React.ComponentProps<typeof Textarea>,
			"name" | "value" | "defaultValue" | "onChange"
		>;
	};

type FormBuilderSelectField<TValues extends FormBuilderValues> =
	FormBuilderBaseField<TValues> & {
		type: "select";
		options: FormBuilderSelectOption[];
		multiple?: boolean;
		placeholder?: string;
		withSearch?: boolean;
		selectContentProps?: Omit<
			React.ComponentProps<typeof SelectContent>,
			"children"
		>;
		selectTriggerProps?: Omit<
			React.ComponentProps<typeof SelectTrigger>,
			"children" | "disabled" | "id"
		>;
	};

type FormBuilderCheckboxField<TValues extends FormBuilderValues> =
	FormBuilderBaseField<TValues> & {
		type: "checkbox";
	};

type FormBuilderCustomField<TValues extends FormBuilderValues> =
	FormBuilderBaseField<TValues> & {
		type: "custom";
		render: (context: FormBuilderFieldContext<TValues>) => React.ReactNode;
	};

type FormBuilderField<TValues extends FormBuilderValues = FormBuilderValues> =
	| FormBuilderInputField<TValues>
	| FormBuilderNumberField<TValues>
	| FormBuilderTextareaField<TValues>
	| FormBuilderSelectField<TValues>
	| FormBuilderCheckboxField<TValues>
	| FormBuilderCustomField<TValues>;

type FormBuilderProps<TValues extends FormBuilderValues = FormBuilderValues> =
	Omit<React.ComponentProps<"form">, "children" | "onChange" | "onSubmit"> & {
		fields: FormBuilderField<TValues>[];
		defaultValues?: Partial<TValues>;
		values?: TValues;
		onChange?: (values: TValues) => void;
		onSubmit?: (
			values: TValues,
			event: React.FormEvent<HTMLFormElement>,
		) => void | Promise<void>;
		submitLabel?: React.ReactNode;
		resetLabel?: React.ReactNode;
		showReset?: boolean;
		actions?: React.ReactNode | ((values: TValues) => React.ReactNode);
	};

function isEmptyValue(value: FormBuilderValue | undefined) {
	return (
		value === undefined ||
		value === "" ||
		(Array.isArray(value) && value.length === 0) ||
		value === false
	);
}

function getFieldDefaultValue<TValues extends FormBuilderValues>(
	field: FormBuilderField<TValues>,
	defaultValues?: Partial<TValues>,
) {
	const givenValue = defaultValues?.[field.name] ?? field.defaultValue;

	if (givenValue !== undefined) {
		return givenValue;
	}

	if (field.type === "checkbox") {
		return false;
	}

	if (field.type === "select" && field.multiple) {
		return [];
	}

	return "";
}

function getInitialValues<TValues extends FormBuilderValues>(
	fields: FormBuilderField<TValues>[],
	defaultValues?: Partial<TValues>,
) {
	return fields.reduce(
		(values, field) => ({
			...values,
			[field.name]: getFieldDefaultValue(field, defaultValues),
		}),
		{} as TValues,
	);
}

function FormBuilder<TValues extends FormBuilderValues = FormBuilderValues>({
	fields,
	defaultValues,
	values: controlledValues,
	onChange,
	onSubmit,
	submitLabel = "Submit",
	resetLabel = "Reset",
	showReset = false,
	actions,
	className,
	...props
}: FormBuilderProps<TValues>) {
	const generatedId = React.useId();
	const initialValues = React.useMemo(
		() => getInitialValues(fields, defaultValues),
		[fields, defaultValues],
	);
	const [uncontrolledValues, setUncontrolledValues] =
		React.useState<TValues>(initialValues);
	const [errors, setErrors] = React.useState<FormBuilderErrors<TValues>>({});
	const values = controlledValues ?? uncontrolledValues;

	React.useEffect(() => {
		if (!controlledValues) {
			setUncontrolledValues(initialValues);
		}
	}, [controlledValues, initialValues]);

	const setValues = React.useCallback(
		(nextValues: React.SetStateAction<TValues>) => {
			const resolvedValues =
				typeof nextValues === "function"
					? (nextValues as (previous: TValues) => TValues)(values)
					: nextValues;

			if (!controlledValues) {
				setUncontrolledValues(resolvedValues);
			}

			onChange?.(resolvedValues);
		},
		[controlledValues, onChange, values],
	);

	const setValue = React.useCallback(
		(name: keyof TValues & string, value: FormBuilderValue) => {
			setValues((currentValues) => ({
				...currentValues,
				[name]: value,
			}));
			setErrors((currentErrors) => ({
				...currentErrors,
				[name]: undefined,
			}));
		},
		[setValues],
	);

	const validate = React.useCallback(() => {
		const nextErrors = fields.reduce<FormBuilderErrors<TValues>>(
			(currentErrors, field) => {
				const value = values[field.name];
				const requiredError =
					field.required && isEmptyValue(value)
						? "Dieses Feld ist erforderlich."
						: undefined;
				const customError =
					field.validate?.(value, values) ?? undefined;

				if (requiredError || customError) {
					currentErrors[field.name] = requiredError ?? customError;
				}

				return currentErrors;
			},
			{},
		);

		setErrors(nextErrors);
		return Object.keys(nextErrors).length === 0;
	}, [fields, values]);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!validate()) {
			return;
		}

		void onSubmit?.(values, event);
	};

	const handleReset = () => {
		setValues(initialValues);
		setErrors({});
	};

	const renderControl = (
		field: FormBuilderField<TValues>,
		fieldId: string,
		labelId: string,
		descriptionId: string,
	) => {
		const value = values[field.name];
		const commonProps = {
			id: fieldId,
			disabled: field.disabled,
			"aria-invalid": Boolean(errors[field.name]) || undefined,
			"aria-describedby": field.description ? descriptionId : undefined,
		};

		if (field.type === "custom") {
			return field.render({
				field,
				value,
				values,
				error: errors[field.name],
				setValue: (nextValue) => setValue(field.name, nextValue),
				setValues,
			});
		}

		if (field.type === "textarea") {
			return (
				<Textarea
					{...commonProps}
					{...field.textareaProps}
					name={field.name}
					placeholder={field.placeholder}
					value={String(value ?? "")}
					onChange={(event) =>
						setValue(field.name, event.target.value)
					}
				/>
			);
		}

		if (field.type === "select") {
			const selectValue = Array.isArray(value)
				? value
				: value === ""
					? null
					: value;

			return (
				<Select
					name={field.name}
					value={selectValue as never}
					onValueChange={(nextValue) =>
						setValue(
							field.name,
							(nextValue ?? "") as FormBuilderValue,
						)
					}
					multiple={field.multiple as never}
					disabled={field.disabled}
					required={field.required}
					items={field.options}
				>
					<SelectTrigger
						{...commonProps}
						{...field.selectTriggerProps}
						className={cn(
							"min-h-11 w-full sm:min-h-8",
							field.selectTriggerProps?.className,
						)}
					>
						<SelectValue placeholder={field.placeholder} />
					</SelectTrigger>
					<SelectContent
						alignItemWithTrigger={false}
						align="start"
						sideOffset={4}
						{...field.selectContentProps}
					>
						{field.options.map((option) => (
							<SelectItem
								key={String(option.value)}
								value={option.value}
								disabled={option.disabled}
								label={option.label}
							>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			);
		}

		if (field.type === "checkbox") {
			return (
				<Checkbox
					{...commonProps}
					name={field.name}
					aria-labelledby={field.label ? labelId : undefined}
					checked={Boolean(value)}
					onCheckedChange={(checked) =>
						setValue(field.name, checked === true)
					}
				/>
			);
		}

		const isNumberField = field.type === "number";

		return (
			<Input
				{...commonProps}
				{...field.inputProps}
				name={field.name}
				type={field.type ?? "text"}
				placeholder={field.placeholder}
				value={String(value ?? "")}
				onChange={(event) => {
					const nextValue =
						isNumberField && field.valueAsNumber !== false
							? event.target.value === ""
								? ""
								: event.target.valueAsNumber
							: event.target.value;
					setValue(field.name, nextValue);
				}}
			/>
		);
	};

	return (
		<form
			data-slot="form-builder"
			className={cn(
				"flex w-full min-w-0 flex-col gap-4 sm:gap-5",
				className,
			)}
			onSubmit={handleSubmit}
			{...props}
		>
			<FieldGroup>
				{fields.map((field) => {
					const error = errors[field.name];
					const fieldId = `${generatedId}-${field.name}`;
					const labelId = `${fieldId}-label`;
					const descriptionId = `${fieldId}-description`;
					const isCheckbox = field.type === "checkbox";

					return (
						<Field
							key={field.name}
							className={field.className}
							orientation={isCheckbox ? "horizontal" : "vertical"}
							data-invalid={Boolean(error) || undefined}
							data-disabled={field.disabled || undefined}
						>
							{isCheckbox &&
								renderControl(
									field,
									fieldId,
									labelId,
									descriptionId,
								)}
							{field.label && (
								<FieldContent>
									{isCheckbox ? (
										<FieldLabel
											id={labelId}
											htmlFor={fieldId}
										>
											{field.label}
										</FieldLabel>
									) : (
										<FieldLabel htmlFor={fieldId}>
											{field.label}
										</FieldLabel>
									)}
									{field.description && (
										<FieldDescription id={descriptionId}>
											{field.description}
										</FieldDescription>
									)}
								</FieldContent>
							)}
							{!isCheckbox &&
								renderControl(
									field,
									fieldId,
									labelId,
									descriptionId,
								)}
							<FieldError>{error}</FieldError>
						</Field>
					);
				})}
			</FieldGroup>

			{actions !== null && (
				<div className="flex w-full flex-col-reverse items-stretch gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end *:data-[slot=button]:w-full sm:*:data-[slot=button]:w-auto">
					{showReset && (
						<Button
							type="button"
							variant="outline"
							onClick={handleReset}
						>
							{resetLabel}
						</Button>
					)}
					{typeof actions === "function" ? actions(values) : actions}
					<Button type="submit">{submitLabel}</Button>
				</div>
			)}
		</form>
	);
}

export {
	FormBuilder,
	type FormBuilderErrors,
	type FormBuilderField,
	type FormBuilderProps,
	type FormBuilderValues,
	type FormBuilderValue,
};
