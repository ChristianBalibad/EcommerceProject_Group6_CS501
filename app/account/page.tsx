'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface LoginFormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export default function AccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, login, logout } = useAuth();
  const urlMode = searchParams.get('mode');
  const [manualMode, setManualMode] = useState<'login' | 'signup' | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const isLogin = urlMode === 'signup' ? false : urlMode === 'login' ? true : manualMode === 'signup' ? false : true;

  const [loginData, setLoginData] = useState<LoginFormData>({
    username: '',
    password: '',
    rememberMe: false,
  });
  const [signupData, setSignupData] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loginErrors, setLoginErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});
  const [signupErrors, setSignupErrors] = useState<Partial<Record<keyof SignupFormData, string>>>({});
  const [loginError, setLoginError] = useState<string>('');

  const handleLoginInputChange = (field: keyof LoginFormData, value: string | boolean) => {
    setLoginData((prev) => ({ ...prev, [field]: value }));
    if (loginErrors[field]) {
      setLoginErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (loginError) {
      setLoginError('');
    }
  };

  const handleSignupInputChange = (field: keyof SignupFormData, value: string) => {
    setSignupData((prev) => ({ ...prev, [field]: value }));
    if (signupErrors[field]) {
      setSignupErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateLoginForm = (): boolean => {
    const newErrors: Partial<Record<keyof LoginFormData, string>> = {};

    if (!loginData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!loginData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    setLoginErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignupForm = (): boolean => {
    const newErrors: Partial<Record<keyof SignupFormData, string>> = {};

    if (!signupData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!signupData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!signupData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!signupData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^09\d{9}$/.test(signupData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Invalid phone number format (09XXXXXXXXX)';
    }
    if (!signupData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (signupData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!signupData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (signupData.password !== signupData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setSignupErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateLoginForm()) {
      const success = await login(loginData.username, loginData.password);
      if (success) {
        setIsRedirecting(true);
        const isAdmin = loginData.username === 'admin';
        router.push(isAdmin ? '/admin' : '/');
      } else {
        setLoginError('Invalid username or password');
      }
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateSignupForm()) {
      console.log('Signup submitted:', signupData);
    }
  };

  const switchToSignup = () => {
    setManualMode('signup');
    setLoginErrors({});
  };

  const switchToLogin = () => {
    setManualMode('login');
    setSignupErrors({});
  };

  if (user && !isRedirecting) {
    return (
      <main className="min-h-screen bg-white py-8">
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '500px' }}>
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19L5 12L12 5" />
              </svg>
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-black mb-2">My Account</h1>
            <p className="text-gray-600">Welcome back, {user.username}!</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-black mb-4">Account Information</h2>
            <div className="space-y-3 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <p className="text-black">{user.username}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <p className="text-black capitalize">{user.role}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full bg-black text-white text-center py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white py-8">
      <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '500px' }}>
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19L5 12L12 5" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-black mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-600">
            {isLogin
              ? 'Sign in to your account to continue shopping'
              : 'Join us to start your shopping journey'}
          </p>
        </div>

        {isLogin ? (
          <form onSubmit={handleLoginSubmit}>
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              {loginError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{loginError}</p>
                </div>
              )}

              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 font-medium mb-1">Demo Accounts:</p>
                <p className="text-xs text-blue-700">Admin: admin / admin</p>
                <p className="text-xs text-blue-700">Customer: customer / customer</p>
              </div>

              <div className="mb-4">
                <label htmlFor="login-username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="login-username"
                  value={loginData.username}
                  onChange={(e) => handleLoginInputChange('username', e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-lg text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200 transition-all ${
                    loginErrors.username ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Enter your username"
                />
                {loginErrors.username && (
                  <p className="text-red-500 text-xs mt-1">{loginErrors.username}</p>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="login-password"
                  value={loginData.password}
                  onChange={(e) => handleLoginInputChange('password', e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-lg text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200 transition-all ${
                    loginErrors.password ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Enter your password"
                />
                {loginErrors.password && (
                  <p className="text-red-500 text-xs mt-1">{loginErrors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={loginData.rememberMe}
                    onChange={(e) => handleLoginInputChange('rememberMe', e.target.checked)}
                    className="w-4 h-4 text-black border-gray-300 rounded focus:ring-gray-200"
                  />
                  <span className="text-sm text-gray-700">Remember me</span>
                </label>
                <Link href="#" className="text-sm text-gray-600 hover:text-black transition-colors">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white text-center py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors font-semibold mb-4"
              >
                Sign In
              </button>

              <div className="text-center">
                <span className="text-sm text-gray-600">Don&apos;t have an account? </span>
                <button
                  type="button"
                  onClick={switchToSignup}
                  className="text-sm text-black font-semibold hover:underline"
                >
                  Sign up
                </button>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit}>
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-amber-600 flex-shrink-0 mt-0.5"
                  >
                    <path
                      d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-amber-800 mb-1">Account Creation Not Available</p>
                    <p className="text-xs text-amber-700 mb-2">
                      New account registration is currently disabled (Wala nay time miss!). Please use one of the demo accounts below:
                    </p>
                    <div className="text-xs text-amber-700 space-y-1">
                      <p><strong>Admin:</strong> admin / admin</p>
                      <p><strong>Customer:</strong> customer / customer</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="signup-firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="signup-firstName"
                    value={signupData.firstName}
                    onChange={(e) => handleSignupInputChange('firstName', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-lg text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200 transition-all ${
                      signupErrors.firstName ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Christian"
                  />
                  {signupErrors.firstName && (
                    <p className="text-red-500 text-xs mt-1">{signupErrors.firstName}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="signup-lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="signup-lastName"
                    value={signupData.lastName}
                    onChange={(e) => handleSignupInputChange('lastName', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-lg text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200 transition-all ${
                      signupErrors.lastName ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Balibad"
                  />
                  {signupErrors.lastName && (
                    <p className="text-red-500 text-xs mt-1">{signupErrors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="signup-email"
                  value={signupData.email}
                  onChange={(e) => handleSignupInputChange('email', e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-lg text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200 transition-all ${
                    signupErrors.email ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="your.email@example.com"
                />
                {signupErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{signupErrors.email}</p>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="signup-phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="signup-phone"
                  value={signupData.phone}
                  onChange={(e) => handleSignupInputChange('phone', e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-lg text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200 transition-all ${
                    signupErrors.phone ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="09123456789"
                />
                {signupErrors.phone && (
                  <p className="text-red-500 text-xs mt-1">{signupErrors.phone}</p>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="signup-password"
                  value={signupData.password}
                  onChange={(e) => handleSignupInputChange('password', e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-lg text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200 transition-all ${
                    signupErrors.password ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Create a password"
                />
                {signupErrors.password && (
                  <p className="text-red-500 text-xs mt-1">{signupErrors.password}</p>
                )}
              </div>

              <div className="mb-6">
                <label htmlFor="signup-confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="signup-confirmPassword"
                  value={signupData.confirmPassword}
                  onChange={(e) => handleSignupInputChange('confirmPassword', e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-lg text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200 transition-all ${
                    signupErrors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Confirm your password"
                />
                {signupErrors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{signupErrors.confirmPassword}</p>
                )}
              </div>

              <button
                type="button"
                disabled
                className="w-full bg-gray-300 text-gray-500 text-center py-3 px-6 rounded-lg cursor-not-allowed font-semibold mb-4"
              >
                Create Account (Disabled)
              </button>

              <div className="text-center">
                <span className="text-sm text-gray-600">Already have an account? </span>
                <button
                  type="button"
                  onClick={switchToLogin}
                  className="text-sm text-black font-semibold hover:underline"
                >
                  Sign in
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:border-gray-400 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:border-gray-400 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </main>
  );
}

