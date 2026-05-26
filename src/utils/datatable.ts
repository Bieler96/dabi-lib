export const Alignment = {
	LEFT: "left",
	CENTER: "center",
	RIGHT: "right",
} as const;

export type Alignment = (typeof Alignment)[keyof typeof Alignment];

export type HeaderGroup = {
	parent: string;
	children: string[];
};

export function getHeaderGroups(
	data: Array<Record<string, unknown>>,
): HeaderGroup[] {
	const allKeys = new Set<string>();
	data.forEach((row) => {
		Object.keys(row).forEach((key) => {
			const value = row[key];
			if (value && typeof value === "object" && !Array.isArray(value)) {
				Object.keys(value).forEach((childKey) => {
					allKeys.add(`${key}.${childKey}`);
				});
			} else {
				allKeys.add(key);
			}
		});
	});

	const groups: Record<string, string[]> = {};
	allKeys.forEach((fullKey) => {
		const [parent, child] = fullKey.split(".");
		if (child) {
			if (!groups[parent]) groups[parent] = [];
			groups[parent].push(child);
		} else {
			if (!groups[fullKey]) groups[fullKey] = [];
		}
	});

	return Object.entries(groups).map(([parent, children]) => ({
		parent,
		children,
	}));
}
