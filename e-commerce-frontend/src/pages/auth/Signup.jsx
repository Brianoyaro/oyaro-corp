import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
// import { FaEnvelope, FaLock, FaSpinner, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
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
const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export function Signup() {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data) => {
    try {

      const result = await signup(data.email, data.password);

      if (result.success) {
        toast.success("Successfully created a new account.")
        setTimeout(() => {
          navigate('/dashboard', {replace: true})
        }, 1500);
      } else {
        toast.warning(result.error || 'Signup failed')
      }
    } catch (err) {
      toast.error(err.message || 'An unexpected error occurred')
    }
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8">
      <main className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8" role="main" aria-labelledby="signup-heading">
        <div className="text-center mb-8">
          <h1 id="signup-heading" className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join Mavuno Hub today</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div>
            <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address
            </label>

            <input
              {...register('email')}
              id="signup-email"
              name="email"
              type="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck="false"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="your@email.com"
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'signup-email-error' : undefined}
            />

            {errors.email && (
              <p id="signup-email-error" role="alert" className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Password
            </label>

            <div className="relative">
              <input
                {...register('password')}
                id="signup-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className={`w-full px-4 py-2 border rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="••••••••"
                aria-invalid={errors.password ? 'true' : 'false'}
                aria-describedby={errors.password ? 'signup-password-error' : undefined}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                aria-controls="signup-password"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {errors.password && (
              <p id="signup-password-error" role="alert" className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Confirm Password
            </label>

            <div className="relative">
              <input
                {...register('confirmPassword')}
                id="signup-confirm-password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className={`w-full px-4 py-2 border rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="••••••••"
                aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                aria-describedby={errors.confirmPassword ? 'signup-confirm-password-error' : undefined}
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded"
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                aria-pressed={showConfirmPassword}
                aria-controls="signup-confirm-password"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {errors.confirmPassword && (
              <p id="signup-confirm-password-error" role="alert" className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                {errors.confirmPassword.message}
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
                Creating Account...
              </span>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-4" aria-hidden="true">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-gray-500 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        <p className="text-center text-gray-600 text-sm">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-green-600 hover:text-green-700 font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded"
          >
            Sign in here
          </Link>
        </p>

        <Link
          to="/"
          className="block text-center text-gray-500 hover:text-gray-700 text-sm mt-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded"
        >
          ← Back to Home
        </Link>
      </main>
    </div>
  );
}
