
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Chip } from './Chip';
import { Input } from './Input';
import { Popover } from './Popover';
import { CommandMenuItem } from './command-menu/CommandMenuItem';

export interface TagInputProps {
	tags: string[];
	setTags: (tags: string[]) => void;
	placeholder?: string;
	suggestions?: string[];
}

export const TagInput: React.FC<TagInputProps> = ({ tags, setTags, placeholder, suggestions = [] }) => {
	const [inputValue, setInputValue] = useState('');
	const [popoverOpen, setPopoverOpen] = useState(false);
	const [activeIndex, setActiveIndex] = useState(0);
	const listRef = useRef<Array<HTMLLIElement | null>>([]);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(event.target.value);
		if (event.target.value && suggestions.length > 0) {
			setPopoverOpen(true);
		} else {
			setPopoverOpen(false);
		}
	};

	const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			if (filteredSuggestions.length > 0 && activeIndex >= 0) {
				addTag(filteredSuggestions[activeIndex]);
			} else if (inputValue.trim() !== '') {
				addTag(inputValue.trim());
			}
		} else if (event.key === 'Backspace' && inputValue === '' && tags.length > 0) {
			setTags(tags.slice(0, -1));
		} else if (event.key === 'ArrowDown') {
			event.preventDefault();
			setActiveIndex((prev) => (prev + 1) % filteredSuggestions.length);
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			setActiveIndex((prev) => (prev - 1 + filteredSuggestions.length) % filteredSuggestions.length);
		}
	};

	const removeTag = (tagToRemove: string) => {
		setTags(tags.filter(tag => tag !== tagToRemove));
	};

	const addTag = (tag: string) => {
		setTags([...tags, tag]);
		setInputValue('');
		setPopoverOpen(false);
		setActiveIndex(0);
	};

	const filteredSuggestions = useMemo(() => {
		return suggestions.filter(suggestion =>
			suggestion.toLowerCase().includes(inputValue.toLowerCase()) && !tags.includes(suggestion)
		);
	}, [inputValue, suggestions, tags]);

	useEffect(() => {
		if (popoverOpen && listRef.current[activeIndex]) {
			listRef.current[activeIndex]?.scrollIntoView({ block: 'nearest' });
		}
	}, [popoverOpen, activeIndex]);

	const popoverContent = (
		<ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
			{filteredSuggestions.map((suggestion, index) => (
				<CommandMenuItem
					key={suggestion}
					ref={(el) => { listRef.current[index] = el; }}
					isActive={activeIndex === index}
					onSelect={() => addTag(suggestion)}
				>
					{suggestion}
				</CommandMenuItem>
			))}
		</ul>
	);

	return (
		<Popover
			open={popoverOpen && filteredSuggestions.length > 0}
			onOpenChange={setPopoverOpen}
			className='max-h-96 overflow-y-auto'
			trigger={
				<div
					className='px-1 flex flex-wrap items-center gap-1 rounded-lg transition duration-150 disabled:opacity-50 disabled:pointer-events-none border border-outline-variant outline-none focus-visible:ring-primary/50 focus-visible:ring-[3px]'
				>
					<div className="h-fit flex flex-wrap gap-1">
						{tags.map(tag => (
							<Chip key={tag} variant="input" onDelete={(e) => {
								e.preventDefault();
								e.stopPropagation();
								removeTag(tag)
							}} label={tag} />
						))}
					</div>
					<Input
						type="text"
						variant='ghost'
						value={inputValue}
						onChange={handleInputChange}
						onKeyDown={handleInputKeyDown}
						placeholder={placeholder || 'Add a tag'}
						style={{ border: 'none', outline: 'none', flex: 1, minWidth: '100px' }}
					/>
				</div>
			}
			content={popoverContent}
		/>
	);
};
