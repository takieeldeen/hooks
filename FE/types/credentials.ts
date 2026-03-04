export const CredentialTypes = ["OPENAI", "ANTHROPIC", "GEMINI"] as const;

export type CredentialType = (typeof CredentialTypes)[number];

export interface Credential {
  id: string;
  name: string;
  type: CredentialType;
  value?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}
