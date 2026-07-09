'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginSchema, type LoginFormData } from '@/lib/validators';
import { useAuth } from '@/hooks/useAuth';
import { Button, Input } from '@/components/ui';
import { TwoFactorPrompt } from './TwoFactorPrompt';

export function LoginForm() {
  const router = useRouter();
  const { login, pendingTwoFactor, isLoading } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setFormError(null);
    try {
      await login(data.emailOrUsername, data.password);
      // If 2FA is required, pendingTwoFactor will be true and we show the prompt inline
      // Otherwise, redirect to dashboard
      if (!pendingTwoFactor) {
        router.push('/dashboard');
      }
    } catch (err) {
      // Generic error message — never reveal which credential was wrong (Property 12)
      setFormError('Invalid email or password');
    }
  };

  // If 2FA is pending, show the TwoFactorPrompt inline
  if (pendingTwoFactor) {
    return <TwoFactorPrompt />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
        label="Email or Username"
        type="text"
        placeholder="you@example.com"
        error={errors.emailOrUsername?.message}
        {...register('emailOrUsername')}
      />

      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password')}
      />

      {/* Forgot password link */}
      <div className="flex justify-end -mt-2">
        <Link
          href="/auth/forgot-password"
          className="text-sm text-cyan-400 hover:text-cyan-300"
        >
          Forgot password?
        </Link>
      </div>

      <Button type="submit" variant="primary" size="lg" loading={isLoading} className="w-full">
        Login
      </Button>

      {/* OAuth placeholder buttons */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#0a0a0f] px-2 text-slate-500">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button type="button" variant="secondary" size="md" disabled>
          Google
        </Button>
        <Button type="button" variant="secondary" size="md" disabled>
          GitHub
        </Button>
      </div>

      {/* Link to register */}
      <p className="text-center text-sm text-slate-400 mt-2">
        Don&apos;t have an account?{' '}
        <Link href="/auth/register" className="text-cyan-400 hover:text-cyan-300 font-medium">
          Register
        </Link>
      </p>
    </form>
  );
}
