'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button, Input, CopyButton } from '@/components/ui';

interface TwoFactorSetupFormData {
  code: string;
}

const MOCK_TOTP_SECRET = 'JBSWY3DPEHPK3PXP';

export function TwoFactorSetup() {
  const router = useRouter();
  const { isLoading } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TwoFactorSetupFormData>();

  const onSubmit = async (data: TwoFactorSetupFormData) => {
    setFormError(null);

    // Validate that it's a 6-digit code
    if (!/^\d{6}$/.test(data.code)) {
      setFormError('Code must be 6 digits');
      return;
    }

    try {
      // Mock: Accept any 6-digit code to enable 2FA
      // In production, this would verify the TOTP code against the secret server-side
      // and then mark the user's account as having 2FA enabled

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // For now, just redirect to dashboard
      // TODO: Update user context to reflect 2FA is enabled
      router.push('/dashboard');
    } catch (err) {
      setFormError('Failed to enable 2FA. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="text-center mb-2">
        <h2 className="text-xl font-semibold text-slate-200 mb-2">
          Set up Two-Factor Authentication
        </h2>
        <p className="text-sm text-slate-400">
          Scan the QR code or enter the secret key manually in your authenticator app
        </p>
      </div>

      {/* Form-level error banner */}
      {formError && (
        <div
          role="alert"
          className="rounded-lg bg-red-500/10 border border-red-500/50 px-4 py-3 text-sm text-red-400"
        >
          {formError}
        </div>
      )}

      {/* QR Code placeholder */}
      <div className="flex flex-col items-center gap-4">
        <div className="w-48 h-48 border-2 border-white/20 rounded-lg flex items-center justify-center bg-white/5">
          <p className="text-center text-sm text-slate-400 px-4">
            Scan with Authenticator App
          </p>
        </div>
      </div>

      {/* TOTP Secret */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-300">
          Or enter this secret key manually:
        </label>
        <div className="flex items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-lg">
          <code className="flex-1 font-mono text-sm text-slate-200 tracking-wider">
            {MOCK_TOTP_SECRET}
          </code>
          <CopyButton value={MOCK_TOTP_SECRET} />
        </div>
      </div>

      {/* Verification Input */}
      <Input
        label="Verification Code"
        type="text"
        inputMode="numeric"
        placeholder="000000"
        maxLength={6}
        pattern="[0-9]*"
        error={errors.code?.message}
        className="text-center text-lg tracking-widest"
        {...register('code', {
          required: 'Verification code is required',
          pattern: {
            value: /^\d{6}$/,
            message: 'Code must be 6 digits',
          },
        })}
      />

      <Button type="submit" variant="primary" size="lg" loading={isLoading} className="w-full">
        Verify &amp; Enable
      </Button>

      <p className="text-xs text-slate-500 text-center">
        Make sure to save your backup codes in a safe place after enabling 2FA
      </p>
    </form>
  );
}
