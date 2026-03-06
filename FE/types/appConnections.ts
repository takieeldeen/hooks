export const AppConnectionTypes = ["GOOGLE", "SLACK", "DISCORD"] as const;
export type AppConnectionType = (typeof AppConnectionTypes)[number];

export interface AppConnection {
  id: string;
  userId: string;
  type: AppConnectionType;
  accessToken: string;
  refreshToken: string | null;
  expiresAt: Date | string | null;
  scope: string | null;
  externalId: string | null;
  externalName: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}
