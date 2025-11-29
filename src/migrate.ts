import { promises as fs } from 'fs';
import path from 'path';
import sql from './db';

async function runSqlFiles(dir: string) {
  const files = (await fs.readdir(dir))
    .filter(f => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    console.log(`  → ${path.basename(dir)}/${file}...`);
    const content = await fs.readFile(path.join(dir, file), 'utf-8');
    const queries = content
      .split(';')
      .map(q => q.trim())
      .filter(q => q.length > 0);

    for (const query of queries) {
      await sql.unsafe(query);
    }
  }
}

export async function runMigrationsAndSeeds() {
  console.log('migrations...');
  await runSqlFiles(path.join(__dirname, '..', 'db', 'migrations'));

  console.log('seeds...');
  await runSqlFiles(path.join(__dirname, '..', 'db', 'seeds'));
}

async function main() {
  try {
    await runMigrationsAndSeeds();
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

main();