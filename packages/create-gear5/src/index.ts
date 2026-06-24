#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import prompts from 'prompts';
import pc from 'picocolors';

async function init() {
    console.log(pc.cyan('🚀 Welcome to @gear5/core Scaffolding!'));

    const args = process.argv.slice(2);
    const targetDir = args[0] || 'my-gear5-app';
    const mode = args[1]; // undefined, 'empty', or 'complete'

    const projectPath = path.join(process.cwd(), targetDir);

    // Default to false (empty mode)
    let options = {
        database: false,
        http: false,
        supabase: false,
        logging: false,
        sentry: false,
        redis: false,
    };

    if (mode === 'complete') {
        console.log(pc.green('📦 COMPLETE mode selected. Installing all available modules...'));
        options = {
            database: true,
            http: true,
            supabase: true,
            logging: true,
            sentry: true,
            redis: true,
        };
    } else if (mode === 'empty') {
        console.log(pc.cyan('🪹 EMPTY mode selected. Scaffolding the bare minimum...'));
    } else {
        // Interactive mode
        const response = await prompts([
            {
                type: 'confirm',
                name: 'database',
                message: 'Would you like to install Drizzle ORM and PostgreSQL drivers?',
                initial: true,
            },
            {
                type: 'confirm',
                name: 'http',
                message: 'Would you like to install Axios and Cockatiel for HTTP requests and resilience?',
                initial: true,
            },
            {
                type: 'confirm',
                name: 'supabase',
                message: 'Would you like to install Supabase for Authentication?',
                initial: true,
            },
            {
                type: 'confirm',
                name: 'logging',
                message: 'Would you like to install Pino for high-performance logging?',
                initial: true,
            },
            {
                type: 'confirm',
                name: 'sentry',
                message: 'Would you like to install Sentry for error tracking?',
                initial: false,
            },
            {
                type: 'confirm',
                name: 'redis',
                message: 'Would you like to install ioredis for caching and idempotency?',
                initial: false,
            }
        ]);

        // Exit if user cancels the prompt (Ctrl+C)
        if (Object.keys(response).length === 0) {
            console.log(pc.red('❌ Scaffolding cancelled.'));
            process.exit(1);
        }

        options = { ...options, ...response };
    }

    // Create project directories
    if (!fs.existsSync(projectPath)) {
        fs.mkdirSync(projectPath, { recursive: true });
    }
    const srcDir = path.join(projectPath, 'src');
    fs.mkdirSync(srcDir, { recursive: true });

    // Map dependencies based on choices and your @gear5/core peerDependencies
    const dependencies: Record<string, string> = {
        "@gear5/core": "latest",
        "zod": "^4.4.3", // Essential peer dependency
    };

    const devDependencies: Record<string, string> = {
        "tsx": "^4.7.0",
        "typescript": "^5.4.0",
        "@types/node": "^20.0.0"
    };

    const scripts: Record<string, string> = {
        "start": "tsx src/main.ts",
        "dev": "tsx watch src/main.ts"
    };

    if (options.database) {
        dependencies["drizzle-orm"] = "^0.45.2";
        dependencies["pg"] = "^8.22.0";
        dependencies["postgres"] = "^3.4.9";
        dependencies["dotenv"] = "^16.4.5";

        devDependencies["drizzle-kit"] = "^0.31.10";
        devDependencies["@types/pg"] = "^8.11.0";

        scripts["db:generate"] = "drizzle-kit generate";
        scripts["db:push"] = "drizzle-kit push";
        scripts["db:migrate"] = "drizzle-kit migrate";
    }
    if (options.http) {
        dependencies["axios"] = "^1.16.1";
        dependencies["cockatiel"] = "^4.0.0";
    }
    if (options.supabase) {
        dependencies["@supabase/supabase-js"] = "^2.35.0";
    }
    if (options.logging) {
        dependencies["pino"] = "^10.3.1";
    }
    if (options.sentry) {
        dependencies["@sentry/node"] = "^7.64.0";
    }
    if (options.redis) {
        dependencies["ioredis"] = "^5.3.1";
    }

    const packageJson = {
        name: targetDir,
        version: "1.0.0",
        private: true,
        type: "module",
        scripts,
        dependencies,
        devDependencies
    };

    fs.writeFileSync(path.join(projectPath, 'package.json'), JSON.stringify(packageJson, null, 2));
    const include = options.database ? ["src/**/*", "drizzle.config.ts"] : ["src/**/*"];
    const tsconfig = {
        compilerOptions: {
            target: "ES2022",
            module: "ESNext",
            moduleResolution: "bundler",
            strict: true,
            esModuleInterop: true,
            skipLibCheck: true,
            forceConsistentCasingInFileNames: true,
            types: ["node"]
        },
        include
    };
    fs.writeFileSync(path.join(projectPath, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2));
    fs.writeFileSync(path.join(projectPath, '.gitignore'), 'node_modules\n.env\ndist\n');

    // Create .env.example
    let envExampleContent = `# Environment Variables Configuration\n\n`;
    if (options.database) {
        envExampleContent += `DATABASE_URL=postgres://postgres:password@localhost:5432/gear5_db\n`;
    }
    if (options.redis) {
        envExampleContent += `REDIS_URL=redis://localhost:6379\n`;
    }
    if (options.supabase) {
        envExampleContent += `SUPABASE_URL=https://your-project.supabase.co\n`;
        envExampleContent += `SUPABASE_KEY=your-anon-key\n`;
    }
    if (options.sentry) {
        envExampleContent += `SENTRY_DSN=your-sentry-dsn\n`;
    }
    fs.writeFileSync(path.join(projectPath, '.env.example'), envExampleContent);

    // If database is selected, generate Drizzle files
    if (options.database) {
        // drizzle.config.ts (in root)
        const drizzleConfigContent = `import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/schema.ts',
  out: './drizzle', // Dir where migration files will be generated
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!
  },
  verbose: true,
  strict: true,
})`;
        fs.writeFileSync(path.join(projectPath, 'drizzle.config.ts'), drizzleConfigContent);

        // schema.ts inside src/
        const schemaContent = `import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

// ─────────────────────────────────────────────────────────────────────────────
// DRIZZLE SCHEMA DEFINITION
// ─────────────────────────────────────────────────────────────────────────────
// This is a simple Drizzle schema definition for a "users" table. It includes an auto-incrementing primary key, a name, an email (which must be unique), and a timestamp for when the record was created.

/**
 * @description The usersTable constant defines the schema for the "users" table in a PostgreSQL database using Drizzle ORM. It includes columns for id, name, email, and createdAt, with appropriate data types and constraints. The UserDto type is inferred from the schema and represents the shape of data that can be inserted into the "users" table.
 */
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
})

export type UserDto = typeof usersTable.$inferInsert
`;
        fs.writeFileSync(path.join(srcDir, 'schema.ts'), schemaContent);
    }

    // Generate bootstrap.ts dynamically
    let bootstrapContent = `import { AppBuilder, LOG_LEVEL } from '@gear5/core';\n\nexport async function bootstrap() {\n  const builder = new AppBuilder();\n`;

    if (mode === 'complete' || Object.values(options).some(v => v === true)) {
        bootstrapContent += `\n  // --- Infrastructure Configuration ---\n`;

        if (options.database) {
            bootstrapContent += `  // builder.addDb(opts => {\n  //   opts.connectionString = process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/db';\n  //   opts.tables = {};\n  // });\n`;
        }
        if (options.redis) {
            bootstrapContent += `  // builder.addCache(opts => {\n  //   opts.inMemory = false;\n  //   opts.redis = { host: 'localhost', port: 6379, password: 'your-password' }; });\n`;
        }
        if (options.logging) {
            if(options.sentry) {
                bootstrapContent += `  // builder.addLogger(opts => {\n  //   opts.level = LOG_LEVEL.ERROR;\n  //   opts.console = false;\n  //   opts.sentry = { config: { dsn: process.env.SENTRY_DSN, environment: process.env.NODE_ENV } };\n  // });\n`;
            } else {
                bootstrapContent += `  // builder.addLogger(opts => {\n  //   opts.level = LOG_LEVEL.INFO;\n  //   opts.console = true; });\n`;
            }
        }
        if (options.supabase) {
            bootstrapContent += `  // builder.addAuth(opts => {\n  //   opts.url = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';\n  //   opts.key = process.env.SUPABASE_ANON_KEY || 'placeholder-key';\n  // });\n`;
        }
        if (options.http) {
            bootstrapContent += `  // builder.addHttpCore(opts => {\n  //   opts.dataSourceToken = YOUR_DATA_SOURCE_TOKEN\n  //   opts.http.client.baseURL = 'BASE_URL'\n  // opts.resilience.retry.attempts = 3\n  //   opts.resilience.circuitBreaker.consecutiveFailures = 5 });\n`;
        }
    }

    bootstrapContent += `\n  return await builder.build();\n}\n`;
    fs.writeFileSync(path.join(srcDir, 'bootstrap.ts'), bootstrapContent);

    // Generate main.ts
    const mainContent = `import { bootstrap } from './bootstrap.js';\n\nasync function main() {\n  try {\n    console.log('⏳ Bootstrapping @gear5/core application...');\n    const container = await bootstrap();\n    console.log('✅ Application started successfully!');\n    \n    // Start your web server or message listener here\n    // const server = container.resolve(MY_SERVER_TOKEN);\n    \n  } catch (error) {\n    console.error('❌ Critical error during startup:', error);\n    process.exit(1);\n  }\n}\n\nmain();\n`;
    fs.writeFileSync(path.join(srcDir, 'main.ts'), mainContent);

    // Generate README.md
    const readmeContent = `# ${targetDir}\n\nProject scaffolded with \`@gear5/create\`.\n\n## Quick Start\n\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\`\n`;
    fs.writeFileSync(path.join(projectPath, 'README.md'), readmeContent);

    // Execute npm install
    console.log(pc.blue('\n⏳ Installing dependencies (this may take a minute)...'));
    try {
        execSync('npm install', { cwd: projectPath, stdio: 'inherit' });
        console.log(pc.green('\n🎉 Project successfully scaffolded!'));
        console.log(pc.white(`\nNext steps:\n  cd ${targetDir}\n  npm run dev\n`));
    } catch (err) {
        console.error(pc.red('\n❌ An error occurred during npm install. You can run it manually.'));
    }
}

init().catch(console.error);