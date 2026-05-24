import { z } from 'zod';

export const setPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(10, 'At least 10 characters')
      .regex(/[A-Z]/, 'Must contain an uppercase letter')
      .regex(/[a-z]/, 'Must contain a lowercase letter')
      .regex(/\d/, 'Must contain a digit'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SetPasswordInput = z.infer<typeof setPasswordSchema>;

const COMMON = new Set([
  'password',
  'password1',
  'password123',
  '12345678',
  'qwerty123',
  'abcd1234',
  'letmein1',
]);

export type PasswordChecks = {
  length: boolean;
  upper: boolean;
  lower: boolean;
  digit: boolean;
  notCompromised: boolean;
};

export function checkPassword(pw: string): PasswordChecks {
  return {
    length: pw.length >= 10,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    digit: /\d/.test(pw),
    notCompromised: pw.length >= 10 && !COMMON.has(pw.toLowerCase()),
  };
}

export function passwordStrength(checks: PasswordChecks): number {
  const score = Object.values(checks).filter(Boolean).length;
  return Math.min(4, Math.round((score / 5) * 4));
}
