import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import {
  Mail,
  Lock,
  Loader2,
  AlertTriangle,
  Eye,
  EyeOff,
} from 'lucide-react';

import { useAuth } from '../../hook/useAuth';
import { Button } from '../../components/Button';
import { toast } from 'sonner';

// Validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, isAuthenticated } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const searchParams = new URLSearchParams(location.search);
      const nextUrl = searchParams.get('next');
      navigate(nextUrl ?? '/dashboard', { replace: true });
    }
  }, [isLoading, isAuthenticated, location.search, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      const result = await login(data.email, data.password);

      if (result.success) {
        const searchParams = new URLSearchParams(location.search);
        const nextUrl = searchParams.get('next');

        toast.success('Login completed successfully');

        navigate(nextUrl ?? '/dashboard', { replace: true });
      } else {
        toast.warning(result.error || 'Login failed');
      }
    } catch (err) {
      toast.error('An unexpected error occurred. Try again');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <main className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8" role="main" aria-labelledby="login-heading">
        <div className="text-center mb-8">
          <h1 id="login-heading" className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p id="login-description" className="text-gray-600">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate aria-describedby="login-description">
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address
            </label>

            <input
              {...register('email')}
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck="false"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="your@email.com"
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'login-email-error' : undefined}
            />

            {errors.email && (
              <p id="login-email-error" role="alert" className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </label>

              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
              >
                Forgot?
              </Link>
            </div>

            <div className="relative">
              <input
                {...register('password')}
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                className={`w-full px-4 py-2 border rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="••••••••"
                aria-invalid={errors.password ? 'true' : 'false'}
                aria-describedby={errors.password ? 'login-password-error' : undefined}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                aria-controls="login-password"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {errors.password && (
              <p id="login-password-error" role="alert" className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading}
            className="w-full mt-8"
            aria-busy={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-4" aria-hidden="true">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-gray-500 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        <p className="text-center text-gray-600 text-sm">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded">
            Create one now
          </Link>
        </p>

        <Link
          to="/"
          className="block text-center text-gray-500 hover:text-gray-700 text-sm mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
        >
          ← Back to Home
        </Link>
      </main>
    </div>
  );
}