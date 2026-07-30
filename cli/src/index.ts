#!/usr/bin/env node
import prompts from 'prompts';
import pc from 'picocolors';
import { ScaffoldingEngine } from './core/scaffolding.engine';
import { ScaffoldingOptions } from './core/generator.interface';

import { PackageJsonGenerator, BootstrapGenerator, MainGenerator, EnvGenerator, TsconfigGenerator, RegistryGenerator, ReadmeGenerator, GitIgnoreGenerator, DrizzleGenerator, DrizzleSqlLiteGenerator } from './generators/index';
import { CommandUtils } from './utils/command.utils';

/**
 * @function init
 * @description Initializes the scaffolding process for a new Xeno project.
 * 
 * @author Xeno
 * @version 1.0.0
 * @license ISC
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js 
 */
async function init() {
  console.log(pc.cyan('\n🚀 Welcome to @xeno/core Scaffolding!'));

  const args = process.argv.slice(2);
  const targetDir = args[0] || 'my-xeno-app';
  const flags = args.slice(1);

  const isFull = flags.includes('--full');
  const isEmpty = flags.includes('--empty');

  let options: ScaffoldingOptions = {
    targetDir,
    zod: isFull,
    database: isFull,
    sqlLite: false,
    http: isFull,
    supabase: isFull,
    logging: isFull,
    sentry: isFull,
    redis: isFull,
  };

  if (!isFull && !isEmpty) {
    const response = await prompts([
      { type: 'confirm', name: 'zod', message: 'Install Zod for validation?', initial: true },
      { type: 'confirm', name: 'database', message: 'Install Drizzle ORM & Postgres?', initial: true },
      { type: 'confirm', name: 'sqlLite', message: 'Install SQLite?', initial: false },
      { type: 'confirm', name: 'http', message: 'Install Axios & Cockatiel?', initial: true },
      { type: 'confirm', name: 'supabase', message: 'Install Supabase?', initial: true },
      { type: 'confirm', name: 'logging', message: 'Install Pino?', initial: true },
      { type: 'confirm', name: 'sentry', message: 'Install Sentry?', initial: false },
      { type: 'confirm', name: 'redis', message: 'Install ioredis?', initial: false },
    ]);

    if(response.database && response.sqlLite) {
      console.log(pc.red('❌ You cannot select both Drizzle ORM & Postgres and SQLite at the same time.'));
      process.exit(1);
    }

    if (Object.keys(response).length === 0) {
      console.log(pc.red('❌ Scaffolding cancelled.'));
      process.exit(1);
    }
    options = { ...options, ...response };
  } else {
    const mode = isFull ? 'FULL' : 'EMPTY';
    console.log(pc.cyan(`📦 ${mode} mode selected.`));
  }

  const engine = new ScaffoldingEngine([
    new PackageJsonGenerator(),
    new TsconfigGenerator(),
    new GitIgnoreGenerator(),
    new EnvGenerator(),
    new RegistryGenerator(),
    new DrizzleGenerator(),
    new DrizzleSqlLiteGenerator(),
    new BootstrapGenerator(),
    new MainGenerator(),
    new ReadmeGenerator(),
  ]);

  try {
    await engine.run(targetDir, options);

    console.log(pc.cyan('\n📦 Installing dependencies...'));
    await CommandUtils.runCommand('npm', ['install'], targetDir);
    console.log(pc.green('\n✅ Scaffolding completed successfully!'));
    console.log(pc.white(`\nNext steps:\n  cd ${targetDir}\n  npm run dev\n`));
  } catch (error) {
    console.error(pc.red('\n❌ Scaffolding failed.'), error);
    process.exit(1);
  }
}

init().catch(console.error);