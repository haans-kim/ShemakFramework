import Database from 'better-sqlite3';
import path from 'path';

const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build';

const dbPath = path.join(process.cwd(), 'shemak.db');

let db: Database.Database;

if (isBuildTime) {
  db = new Database(':memory:');
} else {
  db = new Database(dbPath, {
    readonly: true,
    fileMustExist: false,
  });
}

if (!isBuildTime) {
  db.pragma('journal_mode = WAL');
  db.pragma('busy_timeout = 5000');
  db.pragma('cache_size = 5000');
  db.pragma('foreign_keys = ON');
}

export default db;
