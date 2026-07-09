import { describe, it, expect } from 'vitest';
import {
  registrationSchema,
  loginSchema,
  passwordChangeSchema,
  emailChangeSchema,
  apiKeyCreateSchema,
  teamInviteSchema,
  falsePositiveReportSchema,
  cheatReportSchema,
} from '@/lib/validators';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function errorsFor(result: { success: false; error: { flatten: () => { fieldErrors: Record<string, string[]> } } }) {
  return result.error.flatten().fieldErrors;
}

// ---------------------------------------------------------------------------
// registrationSchema
// ---------------------------------------------------------------------------

describe('registrationSchema', () => {
  const valid = {
    username: 'player_one',
    email: 'player@example.com',
    password: 'Password1',
    passwordConfirm: 'Password1',
    acceptTerms: true,
  };

  it('accepts a fully valid registration payload', () => {
    expect(registrationSchema.safeParse(valid).success).toBe(true);
  });

  // username
  it('rejects username shorter than 3 chars', () => {
    const result = registrationSchema.safeParse({ ...valid, username: 'ab' });
    expect(result.success).toBe(false);
    if (!result.success) expect(errorsFor(result).username).toBeDefined();
  });

  it('rejects username longer than 20 chars', () => {
    const result = registrationSchema.safeParse({ ...valid, username: 'a'.repeat(21) });
    expect(result.success).toBe(false);
  });

  it('rejects username with invalid characters (e.g., hyphen)', () => {
    const result = registrationSchema.safeParse({ ...valid, username: 'player-one' });
    expect(result.success).toBe(false);
  });

  it('accepts username with alphanumeric and underscore', () => {
    expect(registrationSchema.safeParse({ ...valid, username: 'user_123' }).success).toBe(true);
  });

  it('rejects whitespace-only username', () => {
    const result = registrationSchema.safeParse({ ...valid, username: '   ' });
    expect(result.success).toBe(false);
  });

  // email
  it('rejects an invalid email address', () => {
    const result = registrationSchema.safeParse({ ...valid, email: 'not-an-email' });
    expect(result.success).toBe(false);
    if (!result.success) expect(errorsFor(result).email).toBeDefined();
  });

  it('trims whitespace around email', () => {
    const result = registrationSchema.safeParse({ ...valid, email: '  player@example.com  ' });
    expect(result.success).toBe(true);
  });

  // password strength
  it('rejects password shorter than 8 chars', () => {
    const result = registrationSchema.safeParse({ ...valid, password: 'Short1', passwordConfirm: 'Short1' });
    expect(result.success).toBe(false);
    if (!result.success) expect(errorsFor(result).password).toBeDefined();
  });

  it('rejects password missing an uppercase letter', () => {
    const result = registrationSchema.safeParse({ ...valid, password: 'password1', passwordConfirm: 'password1' });
    expect(result.success).toBe(false);
    if (!result.success) expect(errorsFor(result).password).toBeDefined();
  });

  it('rejects password missing a number', () => {
    const result = registrationSchema.safeParse({ ...valid, password: 'PasswordA', passwordConfirm: 'PasswordA' });
    expect(result.success).toBe(false);
    if (!result.success) expect(errorsFor(result).password).toBeDefined();
  });

  // password confirmation
  it('rejects when passwords do not match', () => {
    const result = registrationSchema.safeParse({ ...valid, passwordConfirm: 'Different1' });
    expect(result.success).toBe(false);
  });

  // terms
  it('rejects when acceptTerms is false', () => {
    const result = registrationSchema.safeParse({ ...valid, acceptTerms: false });
    expect(result.success).toBe(false);
  });

  // error isolation — only invalid fields get errors
  it('only reports errors on the invalid field, not valid ones', () => {
    const result = registrationSchema.safeParse({ ...valid, email: 'bad' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = errorsFor(result);
      expect(errors.email).toBeDefined();
      expect(errors.username).toBeUndefined();
      expect(errors.password).toBeUndefined();
    }
  });
});

// ---------------------------------------------------------------------------
// loginSchema
// ---------------------------------------------------------------------------

describe('loginSchema', () => {
  const valid = { emailOrUsername: 'player@example.com', password: 'anything' };

  it('accepts valid login credentials', () => {
    expect(loginSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects empty emailOrUsername', () => {
    const result = loginSchema.safeParse({ ...valid, emailOrUsername: '' });
    expect(result.success).toBe(false);
  });

  it('rejects whitespace-only emailOrUsername', () => {
    const result = loginSchema.safeParse({ ...valid, emailOrUsername: '   ' });
    expect(result.success).toBe(false);
  });

  it('rejects empty password', () => {
    const result = loginSchema.safeParse({ ...valid, password: '' });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// passwordChangeSchema
// ---------------------------------------------------------------------------

describe('passwordChangeSchema', () => {
  const valid = {
    currentPassword: 'OldPassword1',
    newPassword: 'NewPassword1',
    confirmNewPassword: 'NewPassword1',
  };

  it('accepts a valid password change payload', () => {
    expect(passwordChangeSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects empty currentPassword', () => {
    const result = passwordChangeSchema.safeParse({ ...valid, currentPassword: '' });
    expect(result.success).toBe(false);
  });

  it('rejects weak newPassword (no uppercase)', () => {
    const result = passwordChangeSchema.safeParse({
      ...valid,
      newPassword: 'weakpass1',
      confirmNewPassword: 'weakpass1',
    });
    expect(result.success).toBe(false);
  });

  it('rejects when newPassword and confirmNewPassword differ', () => {
    const result = passwordChangeSchema.safeParse({ ...valid, confirmNewPassword: 'Mismatch1' });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// emailChangeSchema
// ---------------------------------------------------------------------------

describe('emailChangeSchema', () => {
  const valid = { newEmail: 'new@example.com', password: 'anypass' };

  it('accepts valid email change payload', () => {
    expect(emailChangeSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects an invalid new email', () => {
    const result = emailChangeSchema.safeParse({ ...valid, newEmail: 'not-valid' });
    expect(result.success).toBe(false);
  });

  it('rejects whitespace-only new email', () => {
    const result = emailChangeSchema.safeParse({ ...valid, newEmail: '   ' });
    expect(result.success).toBe(false);
  });

  it('rejects empty password', () => {
    const result = emailChangeSchema.safeParse({ ...valid, password: '' });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// apiKeyCreateSchema
// ---------------------------------------------------------------------------

describe('apiKeyCreateSchema', () => {
  const valid = { name: 'My API Key', environment: 'production' as const };

  it('accepts a valid API key creation payload', () => {
    expect(apiKeyCreateSchema.safeParse(valid).success).toBe(true);
  });

  it('accepts sandbox environment', () => {
    expect(apiKeyCreateSchema.safeParse({ ...valid, environment: 'sandbox' }).success).toBe(true);
  });

  it('rejects empty name', () => {
    const result = apiKeyCreateSchema.safeParse({ ...valid, name: '' });
    expect(result.success).toBe(false);
  });

  it('rejects whitespace-only name', () => {
    const result = apiKeyCreateSchema.safeParse({ ...valid, name: '   ' });
    expect(result.success).toBe(false);
  });

  it('rejects name longer than 50 characters', () => {
    const result = apiKeyCreateSchema.safeParse({ ...valid, name: 'a'.repeat(51) });
    expect(result.success).toBe(false);
  });

  it('accepts name of exactly 50 characters', () => {
    expect(apiKeyCreateSchema.safeParse({ ...valid, name: 'a'.repeat(50) }).success).toBe(true);
  });

  it('rejects an invalid environment value', () => {
    const result = apiKeyCreateSchema.safeParse({ ...valid, environment: 'staging' });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// teamInviteSchema
// ---------------------------------------------------------------------------

describe('teamInviteSchema', () => {
  it('accepts a valid email address', () => {
    expect(teamInviteSchema.safeParse({ email: 'teammate@example.com' }).success).toBe(true);
  });

  it('rejects an invalid email address', () => {
    const result = teamInviteSchema.safeParse({ email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('rejects an empty email', () => {
    const result = teamInviteSchema.safeParse({ email: '' });
    expect(result.success).toBe(false);
  });

  it('rejects whitespace-only email', () => {
    const result = teamInviteSchema.safeParse({ email: '   ' });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// falsePositiveReportSchema
// ---------------------------------------------------------------------------

describe('falsePositiveReportSchema', () => {
  const valid = {
    contact: 'user@example.com',
    affectedSoftware: 'MyApp v1.0',
    description: 'This is a detailed description that is at least 20 characters long.',
  };

  it('accepts a valid false positive report', () => {
    expect(falsePositiveReportSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects empty contact', () => {
    const result = falsePositiveReportSchema.safeParse({ ...valid, contact: '' });
    expect(result.success).toBe(false);
  });

  it('rejects whitespace-only contact', () => {
    const result = falsePositiveReportSchema.safeParse({ ...valid, contact: '   ' });
    expect(result.success).toBe(false);
  });

  it('rejects empty affectedSoftware', () => {
    const result = falsePositiveReportSchema.safeParse({ ...valid, affectedSoftware: '' });
    expect(result.success).toBe(false);
  });

  it('rejects description shorter than 20 characters', () => {
    const result = falsePositiveReportSchema.safeParse({ ...valid, description: 'Too short.' });
    expect(result.success).toBe(false);
  });

  it('accepts description of exactly 20 characters', () => {
    // 20 visible chars (trim shouldn't affect this)
    expect(
      falsePositiveReportSchema.safeParse({ ...valid, description: '12345678901234567890' }).success
    ).toBe(true);
  });

  it('rejects description of 19 characters (boundary-invalid)', () => {
    const result = falsePositiveReportSchema.safeParse({ ...valid, description: '1234567890123456789' });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// cheatReportSchema
// ---------------------------------------------------------------------------

describe('cheatReportSchema', () => {
  const valid = {
    cheatName: 'AimbotPro',
    source: 'https://cheats.example.com',
    evidence: 'https://video.example.com/clip',
  };

  it('accepts a valid cheat report with evidence', () => {
    expect(cheatReportSchema.safeParse(valid).success).toBe(true);
  });

  it('accepts a cheat report without evidence (optional)', () => {
    const { evidence: _evidence, ...withoutEvidence } = valid;
    expect(cheatReportSchema.safeParse(withoutEvidence).success).toBe(true);
  });

  it('accepts empty string evidence (optional field)', () => {
    expect(cheatReportSchema.safeParse({ ...valid, evidence: '' }).success).toBe(true);
  });

  it('rejects empty cheatName', () => {
    const result = cheatReportSchema.safeParse({ ...valid, cheatName: '' });
    expect(result.success).toBe(false);
  });

  it('rejects whitespace-only cheatName', () => {
    const result = cheatReportSchema.safeParse({ ...valid, cheatName: '   ' });
    expect(result.success).toBe(false);
  });

  it('rejects empty source', () => {
    const result = cheatReportSchema.safeParse({ ...valid, source: '' });
    expect(result.success).toBe(false);
  });

  it('rejects whitespace-only source', () => {
    const result = cheatReportSchema.safeParse({ ...valid, source: '   ' });
    expect(result.success).toBe(false);
  });
});
