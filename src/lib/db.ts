
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
      id: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', // Valid UUID for CypherUser
      username: 'CypherUser',
      email: 'user@nexus.io',
      password: 'password123',
      points: 12500,
      level: 7,
    },
    {
      id: 'd6c5b4a3-f2e1-d0c9-b8a7-9f8e7d6c5b4a', // Valid UUID for Admin1
      username: 'Admin1',
      email: 'admin@nexus.io',
      password: 'Gabriel8',
      points: 99999,
      level: 99,
    },
  ];

  for (const userData of usersToSeed) {
    try {
      const userById = await currentDb.get('SELECT id FROM users WHERE id = ?', userData.id);
      
      if (!userById) {
        // User with this specific ID does not exist, so try to insert.
        // First, check if the email or username is taken by a *different* user.
        const conflictingUser = await currentDb.get(
          'SELECT id FROM users WHERE (email = ? OR username = ?) AND id != ?', 
          userData.email, userData.username, userData.id
        );

        if (conflictingUser) {
          console.warn(`[DB] Seeding user ${userData.username} (ID: ${userData.id}): Email or username (${userData.email}/${userData.username}) already exists with a DIFFERENT ID (${conflictingUser.id}). Skipping this seed entry.`);
          continue;
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        await currentDb.run(
          'INSERT INTO users (id, username, email, passwordHash, points, level, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          userData.id,
          userData.username,
          userData.email,
          hashedPassword,
          userData.points,
          userData.level,
          new Date().toISOString(),
          new Date().toISOString()
        );
        console.log(`[DB] Seeded user: ${userData.username} with ID ${userData.id}`);
      } else {
        // User with this ID already exists. We can optionally update them here if needed,
        // but for this fix, ensuring they exist with the correct ID is the main goal.
        // console.log(`[DB] User ${userData.username} (ID: ${userData.id}) already exists. Seed data not re-applied.`);
      }
    } catch (err) {
      // Catch other potential errors, e.g., other unique constraints if the pre-check wasn't exhaustive
      if (err instanceof Error && (err.message.includes('SQLITE_CONSTRAINT: UNIQUE constraint failed'))) {
         console.warn(`[DB] Warning during seeding for ${userData.username} (ID: ${userData.id}): A unique constraint was violated (likely email or username already exists and pre-check missed it or race condition). Details: ${err.message}`);
      } else {
        console.error(`[DB] Error seeding user ${userData.username} (ID: ${userData.id}):`, err);
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

