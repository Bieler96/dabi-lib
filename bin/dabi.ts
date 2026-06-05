#!/usr/bin/env tsx
import { Command } from "commander";
import fs from "fs-extra";
import path from "path";
import pc from "picocolors";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

program.name("dabi").description("CLI for dabi-lib projects").version("0.0.1");

program
	.command("init [name]")
	.description("Initialize a new dabi-lib project or update an existing one")
	.action(async (name) => {
		const isNewDir = !!name;
		const targetDir = name
			? path.resolve(process.cwd(), name)
			: process.cwd();
		const templateDir = path.resolve(__dirname, "..");

		try {
			if (isNewDir && fs.existsSync(targetDir)) {
				console.error(
					pc.red(`Error: Directory ${name} already exists.`),
				);
				process.exit(1);
			}

			if (isNewDir) {
				console.log(pc.blue(`Creating new project in ${targetDir}...`));
				await fs.ensureDir(targetDir);
			} else {
				console.log(
					pc.blue(`Updating dabi-lib structure in ${targetDir}...`),
				);
			}

			// 1. Create essential folders
			const essentialFolders = [
				"src/features",
				"src/components",
				"src/hooks",
				"src/utils",
				"public",
			];

			for (const folder of essentialFolders) {
				await fs.ensureDir(path.join(targetDir, folder));
			}

			// 2. Copy library folders (synced/overwritten)
			const libFolders = ["src/components", "src/hooks", "src/utils"];

			for (const folder of libFolders) {
				const src = path.join(templateDir, folder);
				const dest = path.join(targetDir, folder);
				if (fs.existsSync(src)) {
					await fs.copy(src, dest, { overwrite: true });
				}
			}

			// 3. Copy individual essential files
			const essentialFiles = ["src/index.css", "src/index.ts"];

			for (const file of essentialFiles) {
				const src = path.join(templateDir, file);
				const dest = path.join(targetDir, file);
				if (fs.existsSync(src)) {
					await fs.copy(src, dest, { overwrite: true });
				}
			}

			// 4. For new projects or if missing, copy configuration
			const isExistingProject = fs.existsSync(
				path.join(targetDir, "package.json"),
			);

			if (isNewDir || !isExistingProject) {
				const configFiles = [
					"package.json",
					"tsconfig.json",
					"tsconfig.app.json",
					"tsconfig.node.json",
					"vite.config.ts",
					"eslint.config.js",
					"index.html",
					".gitignore",
				];

				for (const file of configFiles) {
					const src = path.join(templateDir, file);
					const dest = path.join(targetDir, file);
					if (
						fs.existsSync(src) &&
						(!isExistingProject || !fs.existsSync(dest))
					) {
						await fs.copy(src, dest);
					}
				}

				// Copy the TanStack Router starter if files don't exist
				const appFiles = [
					"src/App.tsx",
					"src/main.tsx",
					"src/router.tsx",
					"src/features/dashboard/index.ts",
					"src/features/dashboard/screens/Dashboard.tsx",
					"src/features/settings/index.ts",
					"src/features/settings/screens/Settings.tsx",
				];
				for (const file of appFiles) {
					const src = path.join(templateDir, file);
					const dest = path.join(targetDir, file);
					if (fs.existsSync(src) && !fs.existsSync(dest)) {
						await fs.copy(src, dest);
					}
				}

				// Update package.json name if it was newly created
				if (isNewDir) {
					const pkgPath = path.join(targetDir, "package.json");
					if (fs.existsSync(pkgPath)) {
						const pkg = await fs.readJson(pkgPath);
						pkg.name = name || path.basename(targetDir);
						pkg.version = "0.1.0";
						// Remove CLI bin from the initialized project
						if (pkg.bin) delete pkg.bin;
						await fs.writeJson(pkgPath, pkg, { spaces: 2 });
					}
				}
			}

			console.log(
				pc.green(
					`\nSuccess! ${isNewDir ? "Project created" : "Structure updated"} successfully.`,
				),
			);
			if (isNewDir) {
				console.log(
					pc.yellow(
						`Next steps:\n  cd ${name}\n  npm install\n  npm run dev`,
					),
				);
			} else {
				console.log(
					pc.yellow(
						`Folders created and core files synced with dabi-lib.`,
					),
				);
			}
		} catch (err) {
			console.error(pc.red("Error during initialization:"), err);
		}
	});

program
	.command("generate <type> <name>")
	.alias("g")
	.description("Generate a new screen (s)")
	.option("-f, --feature <feature>", "Place a screen inside a feature")
	.action(async (type, name, options: { feature?: string }) => {
		const normalizedType = type.toLowerCase();

		if (["screen", "s"].includes(normalizedType)) {
			await generateScreen(name, options.feature);
		} else if (["feature", "f"].includes(normalizedType)) {
			await generateFeature(name);
		} else {
			console.error(pc.red(`Unknown generation type: ${type}`));
		}
	});

async function generateFeature(name: string) {
	const featureName = toRoutePath(name);
	const featureDir = path.join(process.cwd(), "src", "features", featureName);

	if (fs.existsSync(featureDir)) {
		console.error(pc.red(`Feature ${featureName} already exists.`));
		return;
	}

	const folders = ["screens", "components", "hooks", "api", "utils"];
	for (const folder of folders) {
		await fs.ensureDir(path.join(featureDir, folder));
	}

	await fs.writeFile(
		path.join(featureDir, "index.ts"),
		`// Export feature screens, components, hooks, and utilities from here.\n`,
	);

	console.log(pc.green(`Created feature: ${featureDir}`));
}

async function generateScreen(name: string, feature?: string) {
	const fileName = toPascalCase(name);
	const featureName = feature ? toRoutePath(feature) : undefined;
	const routePath = featureName
		? `${featureName}/${toRoutePath(name)}`
		: toRoutePath(name);
	const routeName = featureName
		? `${toCamelCase(featureName)}${fileName}Route`
		: `${toCamelCase(name)}Route`;
	const screenDir = featureName
		? path.join(process.cwd(), "src", "features", featureName, "screens")
		: path.join(
				process.cwd(),
				"src",
				"features",
				toRoutePath(name),
				"screens",
			);
	const filePath = path.join(screenDir, `${fileName}.tsx`);
	const importPrefix = featureName ? "../../.." : "../../..";

	if (fs.existsSync(filePath)) {
		console.error(pc.red(`Screen ${fileName} already exists.`));
		return;
	}

	if (!featureName) {
		await ensureFeatureIndex(path.dirname(screenDir), fileName);
	} else {
		await ensureFeatureIndex(
			path.join(process.cwd(), "src", "features", featureName),
			fileName,
		);
	}

	const content = `import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "${importPrefix}/components/Button";
import { cn } from "${importPrefix}/utils/cn";

export const ${fileName} = () => {
	return (
		<div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 md:p-8">
			<div className="grid gap-2">
				<h1 className="text-3xl font-semibold tracking-normal">
					${fileName}
				</h1>
				<p className="max-w-2xl text-sm text-muted-foreground">
					Welcome to your new screen.
				</p>
			</div>

			<Link
				to="/"
				className={cn(
					buttonVariants({ variant: "outlined" }),
					"w-fit",
				)}
			>
				<ArrowLeft data-icon="inline-start" />
				Back
			</Link>
		</div>
	);
};
`;

	await fs.ensureDir(path.dirname(filePath));
	await fs.writeFile(filePath, content);
	console.log(pc.green(`Created screen: ${filePath}`));

	const routerPath = path.join(process.cwd(), "src", "router.tsx");
	if (fs.existsSync(routerPath)) {
		await registerTanStackRoute(routerPath, {
			componentName: fileName,
			importPath: featureName
				? `./features/${featureName}/screens/${fileName}`
				: `./features/${toRoutePath(name)}/screens/${fileName}`,
			routeName,
			routePath,
		});
		console.log(
			pc.blue(`Registered route '/${routePath}' in src/router.tsx`),
		);
	} else {
		console.log(
			pc.yellow(
				`src/router.tsx not found. Add the route manually for '/${routePath}'.`,
			),
		);
	}
}

async function ensureFeatureIndex(featureDir: string, screenName: string) {
	await fs.ensureDir(path.join(featureDir, "components"));
	await fs.ensureDir(path.join(featureDir, "hooks"));
	await fs.ensureDir(path.join(featureDir, "api"));
	await fs.ensureDir(path.join(featureDir, "utils"));

	const indexPath = path.join(featureDir, "index.ts");
	const exportLine = `export * from "./screens/${screenName}";`;

	if (!fs.existsSync(indexPath)) {
		await fs.writeFile(indexPath, `${exportLine}\n`);
		return;
	}

	const indexContent = await fs.readFile(indexPath, "utf-8");
	if (!indexContent.includes(exportLine)) {
		await fs.writeFile(
			indexPath,
			`${indexContent.trim()}\n${exportLine}\n`,
		);
	}
}

function toPascalCase(value: string) {
	const words = value.match(/[a-zA-Z0-9]+/g) ?? ["Screen"];
	return words
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join("");
}

function toCamelCase(value: string) {
	const pascal = toPascalCase(value);
	return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function toRoutePath(value: string) {
	return (
		value
			.trim()
			.replace(/([a-z0-9])([A-Z])/g, "$1-$2")
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-+|-+$/g, "") || "screen"
	);
}

async function registerTanStackRoute(
	routerPath: string,
	route: {
		componentName: string;
		importPath: string;
		routeName: string;
		routePath: string;
	},
) {
	let routerContent = await fs.readFile(routerPath, "utf-8");
	const routeTreeIncludesRoute = new RegExp(
		`rootRoute\\.addChildren\\(\\[[\\s\\S]*\\b${route.routeName}\\b[\\s\\S]*\\]\\);`,
	).test(routerContent);

	if (!routerContent.includes(route.importPath)) {
		const lines = routerContent.split("\n");
		let lastImportIndex = -1;

		for (let index = 0; index < lines.length; index++) {
			if (lines[index].startsWith("import ")) {
				lastImportIndex = index;
			}
		}

		lines.splice(
			lastImportIndex + 1,
			0,
			`import { ${route.componentName} } from "${route.importPath}";`,
		);
		routerContent = lines.join("\n");
	}

	if (!routerContent.includes(`const ${route.routeName} = createRoute({`)) {
		const routeDeclaration = `const ${route.routeName} = createRoute({
	getParentRoute: () => rootRoute,
	path: "/${route.routePath}",
	component: ${route.componentName},
});

`;

		routerContent = routerContent.replace(
			"const routeTree = rootRoute.addChildren([",
			`${routeDeclaration}const routeTree = rootRoute.addChildren([`,
		);
	}

	if (!routeTreeIncludesRoute) {
		routerContent = routerContent.replace(
			/const routeTree = rootRoute\.addChildren\(\[([\s\S]*?)\]\);/,
			(_match, children: string) => {
				const existingRoutes = children
					.split(",")
					.map((child) => child.trim())
					.filter(Boolean);
				const routes = [route.routeName, ...existingRoutes];

				return `const routeTree = rootRoute.addChildren([
	${routes.join(",\n\t")},
]);`;
			},
		);
	}

	await fs.writeFile(routerPath, routerContent);
}
program.parse();
