'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import SudokuGrid from '@/components/sudokuGrid';
import { toast } from "sonner";
import { useRouter } from 'next/navigation';
import { signIn, signInWithGoogle } from '@/lib/authFunctions';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      const { userAuth, user } = await signIn(email, password);
      if (!user.completeProfile) {
        router.push(`/complete-profile?uid=${user.uid}`);
      } else {
        router.push('/');
      }
      toast.success('Welcome back!');
    } catch (error: any) {
      setError(error.message || 'Login failed.');
      toast.error("Login failed: " + error.message.replace("Firebase:", ""));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const { userAuth, user } = await signInWithGoogle();
      if (!user?.completeProfile) {
        router.push(`/complete-profile?uid=${user?.uid}`);
      } else {
        router.push('/');
      }
      toast.success('Welcome back!');
    } catch (error: any) {
      toast.error("Google login failed: " + error.message.replace("Firebase:", ""));
      console.error('Google login failed:', error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <Card className="overflow-hidden shadow-2xl border-0 backdrop-blur-sm p-0">
          <CardContent className="p-0">
            <div className="flex flex-col lg:flex-row min-h-[600px]">
              {/* Left Side - Illustration */}
              <div className="flex-1 bg-gradient-to-br from-blue-100 to-blue-200 p-8 lg:p-12 flex-col items-center justify-center relative overflow-hidden hidden md:flex">
                <div className="text-center z-10 space-y-6">
                  <div className="animate-fade-in scale-75 sm:scale-90 md:scale-100">
                    <SudokuGrid />
                  </div>
                  <div className="space-y-3 animate-fade-in delay-300">
                    <h2 className="text-3xl lg:text-4xl font-bold text-blue-800 leading-tight">
                      Welcome Back!
                    </h2>
                    <p className="text-blue-600 text-lg max-w-md">
                      Continue your puzzle journey and challenge your mind with engaging Sudoku games!
                    </p>
                  </div>
                </div>

                {/* Background decorations */}
                <div className="absolute top-10 left-10 w-20 h-20 bg-blue-300/20 rounded-full blur-xl"></div>
                <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl"></div>
                <div className="absolute top-1/2 left-5 w-16 h-16 bg-blue-200/30 rounded-full blur-lg"></div>
              </div>

              {/* Right Side - Form */}
              <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center bg-white">
                <div className="max-w-md mx-auto w-full space-y-8">
                  <div className="text-center space-y-2">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">
                      Sign In
                    </h1>
                    <p className="text-gray-600">
                      Welcome back to your puzzle adventure
                    </p>
                  </div>

                  {/* {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                      {error}
                    </div>
                  )} */}

                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-4">
                      <div className="relative">
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="h-12 text-base border-gray-200 focus:border-blue-400 outline-none rounded-xl bg-gray-50/50 transition-all duration-200 hover:border-gray-300"
                        />
                      </div>
                      <div className="relative">
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="h-12 text-base border border-gray-200 rounded-xl bg-gray-50/50 transition-all duration-200 hover:border-gray-300 outline-none focus:outline-none focus:ring-0 focus:border-blue-400 focus:shadow-none"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="cursor-pointer w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Signing In...
                        </div>
                      ) : (
                        'Sign In'
                      )}
                    </Button>
                  </form>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500 font-medium">or continue with</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={isGoogleLoading}
                      variant="outline"
                      className="cursor-pointer w-full h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {isGoogleLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                          Signing in...
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                          </svg>
                          Sign in with Google
                        </div>
                      )}
                    </Button>
                  </div>

                  <p className="text-center text-sm text-gray-500">
                    Don't have an account?{' '}
                    <button
                      className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors hover:cursor-pointer"
                      onClick={() => router.push('/register')}
                    >
                      Sign up here
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
