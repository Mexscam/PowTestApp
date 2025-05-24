
'use server';

import sqlite3 from 'sqlite3';
import { open, type Database } from 'sqlite';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import type { User } from '@/lib/types';

let db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

const DB_PATH = process.env.NODE_ENV === 'production' ? '/data/crypton_nexus.sqlite' : path.join(process.cwd(), 'crypton_nexus.sqlite');


export async function getDbConnection() {
  if (!db) {
    try {
      console.log(`[DB] Connecting to SQLite database at: ${DB_PATH}`);
      const newDb = await open({
        filename: DB_PATH,
        driver: sqlite3.Database,
      });
      console.log('[DB] Successfully connected to SQLite.');

      // Enable WAL mode for better concurrency
      await newDb.exec('PRAGMA journal_mode = WAL;');
      await newDb.exec('PRAGMA foreign_keys = ON;');


      await newDb.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          passwordHash TEXT NOT NULL,
          points INTEGER DEFAULT 0,
          level INTEGER DEFAULT 1,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('[DB] Users table checked/created.');
      
      // Trigger for updatedAt on users table
      await newDb.exec(`
        CREATE TRIGGER IF NOT EXISTS update_users_updatedAt
        AFTER UPDATE ON users
        FOR EACH ROW
        BEGIN
          UPDATE users SET updatedAt = CURRENT_TIMESTAMP WHERE id = OLD.id;
        END;
      `);
      console.log('[DB] Users updatedAt trigger checked/created.');

      // Chat messages table
      await newDb.exec(`
        CREATE TABLE IF NOT EXISTS chat_messages (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          content TEXT NOT NULL,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE 
        );
      `);
      console.log('[DB] Chat messages table checked/created.');


      await seedInitialUsers(newDb);
      db = newDb;
    } catch (error) {
      console.error('[DB] Error connecting to or initializing SQLite:', error);
      throw new Error('Failed to connect to the database.');
    }
  }
  return db;
}


async function seedInitialUsers(currentDb: Database<sqlite3.Database, sqlite3.Statement>) {
  const usersToSeed = [
    {
      id: 'user1', // Predefined ID for consistent mocking
      username: 'CypherUser',
      email: 'user@nexus.io',
      password: 'password123',
      points: 12500,
      level: 7,
    },
    {
      id: 'admin1', // Predefined ID
      username: 'Admin1',
      email: 'admin@nexus.io',
      password: 'Gabriel8',
      points: 99999,
      level: 99,
    },
  ];

  for (const userData of usersToSeed) {
    try {
      const existingUser = await currentDb.get('SELECT id FROM users WHERE email = ? OR username = ? OR id = ?', [userData.email, userData.username, userData.id]);
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        await currentDb.run(
          'INSERT INTO users (id, username, email, passwordHash, points, level, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          userData.id, // Use predefined ID
          userData.username,
          userData.email,
          hashedPassword,
          userData.points,
          userData.level,
          new Date().toISOString(),
          new Date().toISOString()
        );
        console.log(`[DB] Seeded user: ${userData.username}`);
      }
    } catch (err) {
      // Ignore unique constraint errors if user already exists from a partial seed or manual entry
      if (err instanceof Error && (err.message.includes('SQLITE_CONSTRAINT: UNIQUE constraint failed: users.email') || err.message.includes('SQLITE_CONSTRAINT: UNIQUE constraint failed: users.username') || err.message.includes('SQLITE_CONSTRAINT: UNIQUE constraint failed: users.id'))) {
        // console.log(`[DB] User ${userData.username} or email ${userData.email} already exists, skipping seed.`);
      } else {
        console.error(`[DB] Error seeding user ${userData.username}:`, err);
      }
    }
  }
}

// Helper function to map database row to User type (excluding passwordHash)
export async function mapDbUserToSafeUser(dbUser: any): Promise<Omit<User, 'passwordHash'> | null> {
    if (!dbUser) return null; 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safeUserFields } = dbUser;
    return {
        ...safeUserFields,
        createdAt: new Date(safeUserFields.createdAt),
        updatedAt: new Date(safeUserFields.updatedAt),
    };
}
