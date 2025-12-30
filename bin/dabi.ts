#!/usr/bin/env tsx
import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import pc from 'picocolors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

program
    .name('dabi')
    .description('CLI for dabi-lib projects')
    .version('0.0.1');

program
    .command('init [name]')
    .description('Initialize a new dabi-lib project or update an existing one')
    .action(async (name) => {
        const isNewDir = !!name;
        const targetDir = name ? path.resolve(process.cwd(), name) : process.cwd();
        const templateDir = path.resolve(__dirname, '..');

        try {
            if (isNewDir && fs.existsSync(targetDir)) {
                console.error(pc.red(`Error: Directory ${name} already exists.`));
                process.exit(1);
            }

            if (isNewDir) {
                console.log(pc.blue(`Creating new project in ${targetDir}...`));
                await fs.ensureDir(targetDir);
            } else {
                console.log(pc.blue(`Updating dabi-lib structure in ${targetDir}...`));
            }

            // 1. Create essential folders
            const essentialFolders = [
                'src/api',
                'src/screens',
                'src/db',
                'src/components',
                'src/core',
                'src/hooks',
                'src/utils',
                'src/server',
                'src/vite',
                'public'
            ];

            for (const folder of essentialFolders) {
                await fs.ensureDir(path.join(targetDir, folder));
            }

            // 2. Copy library core folders (synced/overwritten)
            const libFolders = [
                'src/components',
                'src/core',
                'src/hooks',
                'src/utils',
                'src/server',
                'src/vite'
            ];

            for (const folder of libFolders) {
                const src = path.join(templateDir, folder);
                const dest = path.join(targetDir, folder);
                if (fs.existsSync(src)) {
                    await fs.copy(src, dest, { overwrite: true });
                }
            }

            // 3. Copy individual essential files
            const essentialFiles = [
                'src/index.css',
                'src/index.ts',
                'src/server.ts'
            ];

            for (const file of essentialFiles) {
                const src = path.join(templateDir, file);
                const dest = path.join(targetDir, file);
                if (fs.existsSync(src)) {
                    await fs.copy(src, dest, { overwrite: true });
                }
            }

            // 4. For new projects or if missing, copy configuration
            const isExistingProject = fs.existsSync(path.join(targetDir, 'package.json'));
            
            if (isNewDir || !isExistingProject) {
                const configFiles = [
                    'package.json',
                    'tsconfig.json',
                    'tsconfig.app.json',
                    'tsconfig.node.json',
                    'vite.config.ts',
                    'drizzle.config.ts',
                    'eslint.config.js',
                    'index.html',
                    '.gitignore'
                ];

                for (const file of configFiles) {
                    const src = path.join(templateDir, file);
                    const dest = path.join(targetDir, file);
                    if (fs.existsSync(src) && (!isExistingProject || !fs.existsSync(dest))) {
                        await fs.copy(src, dest);
                    }
                }

                // Copy basic App/main if they don't exist
                const appFiles = ['src/App.tsx', 'src/main.tsx'];
                for (const file of appFiles) {
                    const src = path.join(templateDir, file);
                    const dest = path.join(targetDir, file);
                    if (fs.existsSync(src) && !fs.existsSync(dest)) {
                        await fs.copy(src, dest);
                    }
                }
                
                // Update package.json name if it was newly created
                if (isNewDir) {
                    const pkgPath = path.join(targetDir, 'package.json');
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

            console.log(pc.green(`\nSuccess! ${isNewDir ? 'Project created' : 'Structure updated'} successfully.`));
            if (isNewDir) {
                console.log(pc.yellow(`Next steps:\n  cd ${name}\n  npm install\n  npm run dev`));
            } else {
                console.log(pc.yellow(`Folders created and core files synced with dabi-lib.`));
            }
        } catch (err) {
            console.error(pc.red('Error during initialization:'), err);
        }
    });

program
    .command('generate <type> <name>')
    .alias('g')
    .description('Generate a new screen, api, or db schema (s, a, d)')
    .action(async (type, name) => {
        const normalizedType = type.toLowerCase();

        if (['screen', 's'].includes(normalizedType)) {
            await generateScreen(name);
        } else if (['api', 'a'].includes(normalizedType)) {
            await generateApi(name);
        } else if (['db', 'schema', 'd'].includes(normalizedType)) {
            await generateDb(name);
        } else {
            console.error(pc.red(`Unknown generation type: ${type}`));
        }
    });

async function generateScreen(name: string) {
    const fileName = name.charAt(0).toUpperCase() + name.slice(1);
    const filePath = path.join(process.cwd(), 'src', 'screens', `${fileName}.tsx`);

    if (fs.existsSync(filePath)) {
        console.error(pc.red(`Screen ${fileName} already exists.`));
        return;
    }

    const content = `import { useNavigation } from "../core/Router";
import { Button } from "../components/Button";

export const ${fileName} = () => {
    const nav = useNavigation();
    
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">${fileName} Screen</h1>
            <p className="mb-4">Welcome to your new screen!</p>
            <Button variant="outlined" onClick={() => nav.popBackStack()}>
                Back
            </Button>
        </div>
    );
};
`;

    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, content);
    console.log(pc.green(`Created screen: ${filePath}`));

    // Try to register in App.tsx
    const appPath = path.join(process.cwd(), 'src', 'App.tsx');
    if (fs.existsSync(appPath)) {
        let appContent = await fs.readFile(appPath, 'utf-8');

        // Add import
        const importName = `${fileName}`;
        const importPath = `./screens/${fileName}`;

        if (!appContent.includes(importPath)) {
            // Find last import
            const lines = appContent.split('\n');
            let lastImportIndex = -1;
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].startsWith('import ')) {
                    lastImportIndex = i;
                }
            }

            if (lastImportIndex !== -1) {
                lines.splice(lastImportIndex + 1, 0, `import { ${importName} } from "${importPath}";`);
                appContent = lines.join('\n');
            } else {
                appContent = `import { ${importName} } from "${importPath}";\n` + appContent;
            }
        }

        // Add route to builder
        const routeAddition = `\t\t\t\tnav.screen('${name.toLowerCase()}', ${fileName});`;
        if (appContent.includes('builder={(nav) => {') && !appContent.includes(`'${name.toLowerCase()}'`)) {
            appContent = appContent.replace('builder={(nav) => {', `builder={(nav) => {\n${routeAddition}`);
            await fs.writeFile(appPath, appContent);
            console.log(pc.blue(`Registered screen in src/App.tsx`));
        } else if (appContent.includes(`'${name.toLowerCase()}'`)) {
            console.log(pc.yellow(`Route '${name.toLowerCase()}' already exists in src/App.tsx`));
        }
    }
}

async function generateApi(name: string) {
    const filePath = path.join(process.cwd(), 'src', 'api', `${name.toLowerCase()}.ts`);

    if (fs.existsSync(filePath)) {
        console.error(pc.red(`API endpoint ${name} already exists.`));
        return;
    }

    const content = `import { Context } from 'hono';

export const GET = async (c: Context) => {
    return c.json({ message: 'Hello from ${name} API!' });
};

export const POST = async (c: Context) => {
    const body = await c.req.json();
    return c.json({ 
        message: 'Data received',
        data: body 
    });
};
`;

    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, content);
    console.log(pc.green(`Created API endpoint: ${filePath}`));
}

async function generateDb(name: string) {
    const schemaPath = path.join(process.cwd(), 'src', 'db', 'schema.ts');

    if (!fs.existsSync(schemaPath)) {
        console.error(pc.red(`Schema file not found at ${schemaPath}`));
        return;
    }

    const tableName = name.toLowerCase();
    const constantName = name.toLowerCase();

    const tableContent = `\nexport const ${constantName} = sqliteTable('${tableName}', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
});\n`;

    let currentContent = await fs.readFile(schemaPath, 'utf-8');
    if (currentContent.includes(`sqliteTable('${tableName}'`)) {
        console.error(pc.red(`Table ${tableName} already exists in schema.ts`));
        return;
    }

    await fs.appendFile(schemaPath, tableContent);
    console.log(pc.green(`Added table ${tableName} to src/db/schema.ts`));
    console.log(pc.yellow(`Next step: Run 'npm run db:push' to update your database.`));
}

program.parse();
