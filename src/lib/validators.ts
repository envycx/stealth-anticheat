import { z } from 'zod';

// ----------------------------------------------------------
// Shared field validators
// ----------------------------------------------------------

const emailField = z.string().trim().email('Invalid email address');

const nonEmptyString = z.string().trim().min(1, 'Required');

const passwordField = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Must contain at least one number');

const usernameField = z
  .string()
  .trim()
  .min(3, 'Username must be at least 3 characters')
  .max(20, 'Username must be at most 20 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Username may only contain letters, numbers, and underscores');

// ----------------------------------------------------------
// 1. Registration schema
// ----------------------------------------------------------

export const registrationSchema = z
  .object({
    username: usernameField,
    email: emailField,
    password: passwordField,
    passwordConfirm: z.string().min(1, 'Required'),
    acceptTerms: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.passwordConfirm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['passwordConfirm'],
      });
    }
    if (!data.acceptTerms) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'You must accept the terms of service',
        path: ['acceptTerms'],
      });
    }
  });

export type RegistrationFormData = z.infer<typeof registrationSchema>;

// ----------------------------------------------------------
// 2. Login schema
// ----------------------------------------------------------

export const loginSchema = z.object({
  emailOrUsername: nonEmptyString,
  password: z.string().min(1, 'Required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ----------------------------------------------------------
// 3. Password change schema
// ----------------------------------------------------------

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, 'Required'),
    newPassword: passwordField,
    confirmNewPassword: z.string().min(1, 'Required'),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmNewPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmNewPassword'],
      });
    }
  });

export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;

// ----------------------------------------------------------
// 4. Email change schema
// ----------------------------------------------------------

export const emailChangeSchema = z.object({
  newEmail: emailField,
  password: z.string().min(1, 'Required'),
});

export type EmailChangeFormData = z.infer<typeof emailChangeSchema>;

// ----------------------------------------------------------
// 5. API key creation schema
// ----------------------------------------------------------

export const apiKeyCreateSchema = z.object({
  name: z.string().trim().min(1, 'Required').max(50, 'Name must be at most 50 characters'),
  environment: z.enum(['production', 'sandbox']),
});

export type ApiKeyCreateFormData = z.infer<typeof apiKeyCreateSchema>;

// ----------------------------------------------------------
// 6. Team invite schema
// ----------------------------------------------------------

export const teamInviteSchema = z.object({
  email: emailField,
});

export type TeamInviteFormData = z.infer<typeof teamInviteSchema>;

// ----------------------------------------------------------
// 7. False positive report schema
// ----------------------------------------------------------

export const falsePositiveReportSchema = z.object({
  contact: nonEmptyString,
  affectedSoftware: nonEmptyString,
  description: z
    .string()
    .trim()
    .min(20, 'Description must be at least 20 characters'),
});

export type FalsePositiveReportFormData = z.infer<typeof falsePositiveReportSchema>;

// ----------------------------------------------------------
// 8. Cheat report schema
// ----------------------------------------------------------

export const cheatReportSchema = z.object({
  cheatName: nonEmptyString,
  source: nonEmptyString,
  evidence: z.string().optional(),
});

export type CheatReportFormData = z.infer<typeof cheatReportSchema>;
