'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registrationSchema, type RegistrationFormData } from '@/lib/validators';
import { useAuth } from '@/hooks/useAuth';
import { Button, Input } from '@/components/ui';

export function RegisterForm() {
  const router = useRouter();
  const { register: registerUser, isLoading } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  const onSubmit = async (data: RegistrationFormData) => {
    setFormError(null);
    try {
      await registerUser(data.username, data.email, data.password);
      router.push('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setFormError(message);
    }
  };

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
        label="Username"
        type="text"
        placeholder="johndoe"
        error={errors.username?.message}
        {...register('username')}
      />

      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password')}
      />

      <Input
        label="Confirm Password"
        type="password"
        placeholder="••••••••"
        error={errors.passwordConfirm?.message}
        {...register('passwordConfirm')}
      />

      {/* Terms of service checkbox */}
      <div className="flex items-start gap-2">
        <input
          id="acceptTerms"
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 text-cyan-500 focus:ring-2 focus:ring-cyan-500/40 focus:ring-offset-2 focus:ring-offset-transparent"
          {...register('acceptTerms')}
        />
        <label htmlFor="acceptTerms" className="text-sm text-slate-300">
          I accept the{' '}
          <Link href="/terms" className="text-cyan-400 hover:text-cyan-300 underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-cyan-400 hover:text-cyan-300 underline">
            Privacy Policy
          </Link>
        </label>
      </div>
      {errors.acceptTerms && (
        <p className="text-xs text-red-400" role="alert">
          {errors.acceptTerms.message}
        </p>
      )}

      <Button type="submit" variant="primary" size="lg" loading={isLoading} className="w-full mt-2">
        Create Account
      </Button>

      {/* Link to login */}
      <p className="text-center text-sm text-slate-400">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-cyan-400 hover:text-cyan-300 font-medium">
          Login
        </Link>
      </p>
    </form>
  );
}
