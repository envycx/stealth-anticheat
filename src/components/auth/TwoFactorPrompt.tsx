'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button, Input } from '@/components/ui';

interface TwoFactorFormData {
  code: string;
}

export function TwoFactorPrompt() {
  const router = useRouter();
  const { verifyTwoFactor, isLoading } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TwoFactorFormData>();

  const onSubmit = async (data: TwoFactorFormData) => {
    setFormError(null);
    try {
      await verifyTwoFactor(data.code);
      router.push('/dashboard');
    } catch (err) {
      setFormError('Invalid verification code. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="text-center mb-2">
        <h2 className="text-xl font-semibold text-slate-200 mb-2">
          Enter your authentication code
        </h2>
        <p className="text-sm text-slate-400">
          Enter the 6-digit code from your authenticator app
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
        Verify
      </Button>
    </form>
  );
}
