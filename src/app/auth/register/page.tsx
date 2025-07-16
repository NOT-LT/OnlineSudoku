'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Facebook } from 'lucide-react';
import SudokuGrid from '@/components/sudokuGrid';
import { toast } from "sonner"
import { useRouter } from 'next/navigation';
import { registerUser, registerWithGoogle } from '@/lib/authFunctions'; // Import your auth functions if needed

const RegistrationPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      const user = await registerUser(email, password);
      router.push(`/profile?uid=${user.uid}`);
    } catch (error: any) {
      setError(error.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setIsGoogleLoading(true);

    // Simulate Google registration
    setTimeout(() => {
      setIsGoogleLoading(false);
      toast.success('Signed up with Google successfully!');
      console.log('Google registration attempted');
    }, 1500);
  };

  const handleFacebookRegister = () => {
    toast.info('Facebook registration coming soon!');
    console.log('Facebook registration attempted');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <Card className="overflow-hidden shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-0">
            <div className="flex flex-col lg:flex-row min-h-[600px]">
              {/* Left Side - Illustration */}
              <div className="flex-1 bg-gradient-to-br from-blue-100 to-blue-200 p-8 lg:p-12 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="text-center z-10 space-y-6">
                  <div className="animate-fade-in">
                    <SudokuGrid />
                  </div>
                  <div className="space-y-3 animate-fade-in delay-300">
                    <h2 className="text-3xl lg:text-4xl font-bold text-blue-800 leading-tight">
                      Join the Sudoku Community
                    </h2>
                    <p className="text-blue-600 text-lg max-w-md">
                      Challenge your mind and compete with puzzle enthusiasts from around the world!
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
                      Create Account
                    </h1>
                    <p className="text-gray-600">
                      Start your puzzle journey today
                    </p>
                  </div>

                  <form onSubmit={handleRegister} className="space-y-6">
                    <div className="space-y-4">
                      <div className="relative">
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="h-12 text-base border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl bg-gray-50/50 transition-all duration-200 hover:border-gray-300"
                        />
                      </div>
                      <div className="relative">
                        <Input
                          type="password"
                          placeholder="Create a password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="h-12 text-base border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl bg-gray-50/50 transition-all duration-200 hover:border-gray-300"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Creating Account...
                        </div>
                      ) : (
                        'Register'
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
                      onClick={handleGoogleRegister}
                      disabled={isGoogleLoading}
                      variant="outline"
                      className="w-full h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {isGoogleLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                          Signing up...
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                          </svg>
                          Sign up with Google
                        </div>
                      )}
                    </Button>

                    <Button
                      type="button"
                      onClick={handleFacebookRegister}
                      className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-3">
                        <Facebook className="w-5 h-5" />
                        Sign up with Facebook
                      </div>
                    </Button>
                  </div>

                  <p className="text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <button className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">
                      Sign in here
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

export default RegistrationPage;