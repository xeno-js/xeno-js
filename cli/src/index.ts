#!/usr/bin/env node
import prompts from 'prompts';
import pc from 'picocolors';
import { ScaffoldingEngine } from './core/scaffolding.engine';
import { ScaffoldingOptions } from './core/generator.interface';

import { PackageJsonGenerator, BootstrapGenerator, MainGenerator, EnvGenerator, TsconfigGenerator, TokensGenerator, ReadmeGenerator, GitIgnoreGenerator, DrizzleGenerator } from './generators/index';
import { CommandUtils } from './utils/command.utils';

async function init() {
  console.log(pc.cyan('\n🚀 Welcome to @xeno Scaffolding!'));

  const args = process.argv.slice(2);
  const targetDir = args[0] || 'my-xeno-app';
  const flags = args.slice(1);

  const isFull = flags.includes('--full');
  const isEmpty = flags.includes('--empty');

  let options: ScaffoldingOptions = {
    targetDir,
    database: isFull,
    http: isFull,
    supabase: isFull,
    logging: isFull,
    sentry: isFull,
    redis: isFull,
  };

  if (!isFull && !isEmpty) {
    const response = await prompts([
      { type: 'confirm', name: 'database', message: 'Install Drizzle ORM & Postgres?', initial: true },
      { type: 'confirm', name: 'http', message: 'Install Axios & Cockatiel?', initial: true },
      { type: 'confirm', name: 'supabase', message: 'Install Supabase?', initial: true },
      { type: 'confirm', name: 'logging', message: 'Install Pino?', initial: true },
      { type: 'confirm', name: 'sentry', message: 'Install Sentry?', initial: false },
      { type: 'confirm', name: 'redis', message: 'Install ioredis?', initial: false },
    ]);

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
    new TokensGenerator(),
    new DrizzleGenerator(),
    new BootstrapGenerator(),
    new MainGenerator(),
    new ReadmeGenerator(),
  ]);

  try {
    await engine.run(targetDir, options);

    console.log(pc.cyan('\n📦 Installing dependencies...'));
    await CommandUtils.runCommand('npm', ['install'], targetDir);

    console.log(pc.cyan('\n🚀 Starting development server...'));
    await CommandUtils.runCommand('npm', ['run', 'dev'], targetDir);

    console.log(pc.white(`\nNext steps:\n  cd ${targetDir}\n  npm run dev\n`));
  } catch (error) {
    console.error(pc.red('\n❌ Scaffolding failed.'), error);
    process.exit(1);
  }
}

init().catch(console.error);