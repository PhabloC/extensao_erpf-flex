import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
const nameFlagIndex = args.findIndex(
  (argument) => argument === '-n' || argument === '--name',
);

if (nameFlagIndex === -1 || !args[nameFlagIndex + 1]) {
  console.error(
    'Use: npm run migration:generate -- -n NomeDaMigration',
  );
  process.exit(1);
}

const migrationName = args[nameFlagIndex + 1];
const migrationPath = `src/database/migrations/${Date.now()}-${migrationName}`;

const result = spawnSync(
  process.execPath,
  [
    '--require',
    'ts-node/register',
    './node_modules/typeorm/cli.js',
    'migration:generate',
    migrationPath,
    '-d',
    'src/database/typeorm.datasource.ts',
  ],
  {
    stdio: 'inherit',
  },
);

process.exit(result.status ?? 1);
