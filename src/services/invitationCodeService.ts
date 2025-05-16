
// src/services/invitationCodeService.ts
import { MOCK_INVITATION_CODES, type InvitationCode } from '@/lib/types';

// Simulate async operations
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getAllInvitationCodes(): Promise<InvitationCode[]> {
  await delay(100);
  return [...MOCK_INVITATION_CODES]; // Return a copy
}

export async function getInvitationCodeByCode(code: string): Promise<InvitationCode | undefined> {
  await delay(50);
  const codeEntry = MOCK_INVITATION_CODES.find(c => c.code === code.trim().toUpperCase());
  return codeEntry ? { ...codeEntry } : undefined;
}

export async function getInvitationCodeById(id: string): Promise<InvitationCode | undefined> {
  await delay(50);
  const codeEntry = MOCK_INVITATION_CODES.find(c => c.id === id);
  return codeEntry ? { ...codeEntry } : undefined;
}

export async function addInvitationCode(codeValue: string): Promise<InvitationCode> {
  await delay(100);
  const trimmedCode = codeValue.trim().toUpperCase();
  if (!trimmedCode) {
    throw new Error("邀请码值不能为空。");
  }
  if (MOCK_INVITATION_CODES.some(c => c.code === trimmedCode)) {
    throw new Error("此邀请码已存在。");
  }
  const newCode: InvitationCode = {
    id: `code-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    code: trimmedCode,
    usedBy: null,
    createdAt: new Date().toISOString(),
    isValid: true,
  };
  MOCK_INVITATION_CODES.unshift(newCode); // Add to the beginning for newest first
  return { ...newCode };
}

export async function useInvitationCode(codeId: string, userId: string): Promise<InvitationCode | null> {
  await delay(100);
  const codeIndex = MOCK_INVITATION_CODES.findIndex(c => c.id === codeId);
  if (codeIndex > -1) {
    if (MOCK_INVITATION_CODES[codeIndex].isValid && !MOCK_INVITATION_CODES[codeIndex].usedBy) {
      MOCK_INVITATION_CODES[codeIndex].usedBy = userId;
      MOCK_INVITATION_CODES[codeIndex].isValid = false;
      return { ...MOCK_INVITATION_CODES[codeIndex] };
    } else {
      throw new Error("邀请码无效或已被使用。");
    }
  }
  return null; // Or throw error if not found
}

export async function deleteInvitationCode(codeId: string): Promise<boolean> {
  await delay(100);
  const codeIndex = MOCK_INVITATION_CODES.findIndex(c => c.id === codeId);
  if (codeIndex > -1) {
    MOCK_INVITATION_CODES.splice(codeIndex, 1);
    return true;
  }
  return false;
}
