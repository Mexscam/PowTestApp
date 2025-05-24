
'use server';

import type { User } from '@/lib/types'; // Assuming you have a User type

// Mock user data (in a real app, this would interact with a database)
const MOCK_USERS: Record<string, Omit<User, 'passwordHash'>> = {
  "user@nexus.io": {
    id: "user1",
    username: "CypherUser",
    email: "user@nexus.io",
    points: 12500,
    level: 7,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
};

export async function loginUser(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  console.log('[Server Action] Login attempt:', { email, password });

  // Simulate database lookup & password check
  // In a real app:
  // 1. Fetch user by email from DB.
  // 2. Compare provided password (hashed) with stored passwordHash.
  // 3. If match, generate JWT or session token.

  if (MOCK_USERS[email] && password === "password123") { // Super simple mock check
    console.log('[Server Action] Login successful for:', email);
    // In a real app, you'd set a cookie with JWT or session ID here
    return { success: true, message: 'Login successful!', user: MOCK_USERS[email] };
  } else {
    console.log('[Server Action] Login failed for:', email);
    return { success: false, message: 'Invalid email or password.' };
  }
}

export async function registerUser(formData: FormData) {
  const username = formData.get('username') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  console.log('[Server Action] Registration attempt:', { username, email, password });

  // Simulate database insertion
  // In a real app:
  // 1. Check if email or username already exists.
  // 2. Hash the password.
  // 3. Store the new user in the database.

  if (MOCK_USERS[email]) {
    return { success: false, message: 'Email already registered.' };
  }

  const newUser: Omit<User, 'passwordHash'> = {
    id: `user-${Date.now()}`, // simple unique ID
    username,
    email,
    points: 0,
    level: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  MOCK_USERS[email] = newUser; // Add to mock store

  console.log('[Server Action] Registration successful for:', newUser);
  return { success: true, message: 'Registration successful! Please log in.' };
}
