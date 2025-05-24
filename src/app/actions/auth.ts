
'use server';

import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { getDbConnection, mapDbUserToSafeUser } from '@/lib/db';
import type { User } from '@/lib/types';


export async function loginUser(formData: FormData) {
  const emailOrUsername = formData.get('email') as string;
  const password = formData.get('password') as string;

  console.log('[Server Action] Login attempt:', { emailOrUsername, password });

  try {
    const db = await getDbConnection();
    // Try to find user by email or username
    const userRow = await db.get<User & { passwordHash: string }>(
      'SELECT * FROM users WHERE email = ? OR username = ?',
      emailOrUsername,
      emailOrUsername
    );

    if (!userRow) {
      console.log('[Server Action] Login failed: User not found for', emailOrUsername);
      return { success: false, message: 'Invalid email/username or password.' };
    }

    const passwordMatch = await bcrypt.compare(password, userRow.passwordHash);

    if (passwordMatch) {
      console.log('[Server Action] Login successful for:', emailOrUsername);
      const safeUser = await mapDbUserToSafeUser(userRow);
      return { success: true, message: 'Login successful!', user: safeUser };
    } else {
      console.log('[Server Action] Login failed: Password mismatch for', emailOrUsername);
      return { success: false, message: 'Invalid email/username or password.' };
    }
  } catch (error) {
    console.error('[Server Action] Login error:', error);
    return { success: false, message: 'An error occurred during login. Please try again.' };
  }
}

export async function registerUser(formData: FormData) {
  const username = formData.get('username') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  console.log('[Server Action] Registration attempt:', { username, email });

  if (!username || !email || !password) {
    return { success: false, message: 'All fields are required.' };
  }
  if (password.length < 6) {
     return { success: false, message: 'Password must be at least 6 characters.' };
  }


  try {
    const db = await getDbConnection();

    // Check if email or username already exists
    const existingUser = await db.get('SELECT id FROM users WHERE email = ? OR username = ?', email, username);
    if (existingUser) {
      console.log('[Server Action] Registration failed: Email or Username already registered.');
      return { success: false, message: 'Email or Username already registered.' };
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    const now = new Date().toISOString();

    await db.run(
      'INSERT INTO users (id, username, email, passwordHash, points, level, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      userId,
      username,
      email,
      passwordHash,
      0, // Default points
      1, // Default level
      now,
      now
    );

    console.log('[Server Action] Registration successful for user:', username, email);
    return { success: true, message: 'Registration successful! Please log in.' };
  } catch (error) {
    console.error('[Server Action] Registration error:', error);
    return { success: false, message: 'An error occurred during registration. Please try again.' };
  }
}
