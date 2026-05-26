import type { UniqueIdentifier } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

type ItemIdGetter<T> = (item: T) => UniqueIdentifier;

function defaultGetItemId<T extends { id: UniqueIdentifier }>(item: T) {
	return item.id;
}

export function getItemIndex<T>(
	items: T[],
	id: UniqueIdentifier,
	getItemId: ItemIdGetter<T>,
) {
	return items.findIndex((item) => getItemId(item) === id);
}

export function getItemById<T>(
	items: T[],
	id: UniqueIdentifier,
	getItemId: ItemIdGetter<T>,
) {
	return items.find((item) => getItemId(item) === id);
}

export function reorderItems<T extends { id: UniqueIdentifier }>(
	items: T[],
	activeId: UniqueIdentifier,
	overId: UniqueIdentifier | null | undefined,
): T[];
export function reorderItems<T>(
	items: T[],
	activeId: UniqueIdentifier,
	overId: UniqueIdentifier | null | undefined,
	getItemId: ItemIdGetter<T>,
): T[];
export function reorderItems<T>(
	items: T[],
	activeId: UniqueIdentifier,
	overId: UniqueIdentifier | null | undefined,
	getItemId?: ItemIdGetter<T>,
) {
	if (overId == null || activeId === overId) {
		return items;
	}

	const resolveItemId =
		getItemId ?? (defaultGetItemId as unknown as ItemIdGetter<T>);
	const oldIndex = getItemIndex(items, activeId, resolveItemId);
	const newIndex = getItemIndex(items, overId, resolveItemId);

	if (oldIndex < 0 || newIndex < 0) {
		return items;
	}

	return arrayMove(items, oldIndex, newIndex);
}

export function moveItem<T>(items: T[], fromIndex: number, toIndex: number) {
	if (
		fromIndex === toIndex ||
		fromIndex < 0 ||
		toIndex < 0 ||
		fromIndex >= items.length ||
		toIndex >= items.length
	) {
		return items;
	}

	return arrayMove(items, fromIndex, toIndex);
}
