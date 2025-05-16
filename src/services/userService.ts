
// src/services/userService.ts
import { MOCK_USERS, MOCK_USER_CREDENTIALS, type User } from '@/lib/types';

// Simulate async operations
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getAllUsers(): Promise<User[]> {
  await delay(100); // Simulate network latency
  return [...MOCK_USERS]; // Return a copy
}

export async function getUserById(id: string): Promise<User | undefined> {
  await delay(50);
  return MOCK_USERS.find(u => u.id === id);
}

export async function getUserByMobile(mobile: string): Promise<User | undefined> {
  await delay(50);
  return MOCK_USERS.find(u => u.mobile === mobile);
}

export async function addUser(mobile: string, password: string):Promise<User> {
  await delay(100);
  if (MOCK_USERS.find(u => u.mobile === mobile)) {
    throw new Error("手机号码已被注册。");
  }
  const newUser: User = {
    id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    mobile,
    role: 'user',
  };
  MOCK_USERS.push(newUser);
  MOCK_USER_CREDENTIALS[mobile] = password;
  return { ...newUser };
}

export async function deleteUser(userId: string): Promise<boolean> {
  await delay(100);
  const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
  if (userIndex > -1) {
    // Ensure admin cannot be deleted
    if (MOCK_USERS[userIndex].role === 'admin') {
        console.warn("Attempted to delete an admin user.");
        return false; 
    }
    MOCK_USERS.splice(userIndex, 1);
    // Also remove credentials if any - careful in real app with relations
    // For mock: delete MOCK_USER_CREDENTIALS[MOCK_USERS[userIndex].mobile];
    return true;
  }
  return false;
}

export async function validateUserCredentials(mobile: string, password: string): Promise<User | null> {
  await delay(100);
  const user = MOCK_USERS.find(u => u.mobile === mobile);
  if (user && MOCK_USER_CREDENTIALS[mobile] === password) {
    return { ...user };
  }
  return null;
}
