import { spawnSync } from 'node:child_process';

const result = spawnSync(
  process.execPath,
  [
    '--require',
    'ts-node/register',
    './node_modules/typeorm/cli.js',
    'migration:run',
    '-d',
    'src/database/typeorm.datasource.ts',
  ],
  {
    stdio: 'inherit',
  },
);

process.exit(result.status ?? 1);
