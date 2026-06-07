import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';

const extensionRoot = process.cwd();
const manifestPath = path.join(extensionRoot, 'manifest.json');
const requiredFiles = [
  'manifest.json',
  'popup.html',
  'advanced-settings.html',
  'popup.css',
  'src/background.js',
  'src/content-script.js',
  'src/popup.js',
  'src/advanced-settings.js',
];

for (const relativePath of requiredFiles) {
  await access(path.join(extensionRoot, relativePath));
}

const manifestRaw = await readFile(manifestPath, 'utf8');
const manifest = JSON.parse(manifestRaw);

if (manifest.manifest_version !== 3) {
  throw new Error('A extensao precisa usar manifest_version 3.');
}

for (const relativePath of requiredFiles.filter((file) => file.endsWith('.js'))) {
  const result = spawnSync(process.execPath, ['--check', relativePath], {
    cwd: extensionRoot,
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    throw new Error(result.stderr || `Falha de sintaxe em ${relativePath}.`);
  }
}

console.log('Extension check passed.');
