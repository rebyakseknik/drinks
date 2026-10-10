// @ts-nocheck

export interface ChangePasswordDto {
  currentPassword: string;
  /** @minLength 8 */
  newPassword: string;
}
