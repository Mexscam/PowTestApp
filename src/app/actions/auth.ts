
'use server';

import type { User } from '@/lib/types';

// Define an interface for our mock user store that includes a mock password
interface MockUserEntry extends Omit<User, 'passwordHash'> {
  mockPassword?: string; // Store plain text password for mock purposes
}

// Mock user data (in a real app, this would interact with a database)
// Initialize with the default user and their mock password
const MOCK_USERS: Record<string, MockUserEntry> = {
  "user@nexus.io": {
    id: "user1",
    username: "CypherUser",
    email: "user@nexus.io",
    points: 12500,
    level: 7,
    createdAt: new Date(),
    updatedAt: new Date(),
    mockPassword: "password123", // Default user's password
  },
  "Admin1": { // Using username as key for simplicity, assuming it's unique for login
    id: "adminUser1",
    username: "Admin1",
    email: "admin@nexus.io", // Assuming an email for the admin
    points: 99999,
    level: 99,
    createdAt: new Date(),
    updatedAt: new Date(),
    mockPassword: "Gabriel8",
  }
};

export async function loginUser(formData: FormData) {
  const emailOrUsername = formData.get('email') as string; // Can be email or username
  const password = formData.get('password') as string;

  console.log('[Server Action] Login attempt:', { emailOrUsername, password });

  // Find user by email or username
  const userEntry = MOCK_USERS[emailOrUsername] || Object.values(MOCK_USERS).find(u => u.username === emailOrUsername);


  // Check if user exists and the provided password matches the stored mockPassword
  if (userEntry && userEntry.mockPassword === password) {
    console.log('[Server Action] Login successful for:', emailOrUsername);
    // Exclude mockPassword from the user object sent to the client
    const { mockPassword, ...userDetailsToReturn } = userEntry;
    return { success: true, message: 'Login successful!', user: userDetailsToReturn };
  } else {
    console.log('[Server Action] Login failed for:', emailOrUsername);
    return { success: false, message: 'Invalid email/username or password.' };
  }
}

export async function registerUser(formData: FormData) {
  const username = formData.get('username') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  console.log('[Server Action] Registration attempt:', { username, email, password });

  if (MOCK_USERS[email] || Object.values(MOCK_USERS).find(u => u.username === username)) {
    return { success: false, message: 'Email or Username already registered.' };
  }

  // Create new user with the provided password stored as mockPassword
  const newUser: MockUserEntry = {
    id: `user-${Date.now()}`, // simple unique ID
    username,
    email,
    points: 0,
    level: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    mockPassword: password, // Store the chosen password
  };
  MOCK_USERS[email] = newUser; // Add to mock store using email as key
  // If you want to allow login by username for registered users as well, you might need a different structure or a secondary lookup

  console.log('[Server Action] Registration successful for:', newUser);
  // Important: Do not send newUser.mockPassword to client here if you were to return the user object
  return { success: true, message: 'Registration successful! Please log in.' };
}
