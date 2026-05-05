export type UserRole = "USER" | "SELLER" | "SERVICE_PROVIDER";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string;
  hasOnboarded: boolean;
}