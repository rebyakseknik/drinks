// @ts-nocheck

export interface SignupDto {
  email: string;
  /** @minLength 8 */
  password: string;
  name: string;
  inviteCode?: string;
}
