// app/profile/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { hasCompletedProfile, isUsernameAvailable, updateUserProfile, uploadUserAvatar } from '@/lib/authFunctions';
import { useUser } from '@/context/userContext';
import SudokuLoading from '@/components/SudokuLoading';
import { toast } from 'sonner';

export default function ProfilePage() {
  const userContext = useUser();
  const { user, loading: contextLoading, updateUser } = userContext || { user: null, loading: true, updateUser: () => { } };
  const router = useRouter();

  const [name, setName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const avatarURL = useRef<string | null>(null);
  const avatar = useRef<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [usernameState, setUsernameState] = useState<'checking' | 'available' | 'taken'>('checking');

  // This ensures we only set state when user data is available
  useEffect(() => {
    if (user && !contextLoading) {
      setName(user?.displayName || user?.name || user?.Name || user?.fullName || '');
      setUsername(user?.username || '');
      avatarURL.current = user?.avatar || user?.avatarURL || null;
    }
  }, [user, contextLoading]);

  useEffect(() => {
    const checkProfileCompletion = async () => {
      // Wait for context to load
      if (contextLoading) return;

      // If no user after loading, redirect to login
      if (!user) {
        console.log('No user found, redirecting to login...');
        router.push('/login');
        return;
      }

      try {
        const isComplete = await hasCompletedProfile(user.uid);
        if (isComplete) {
          // Redirect if the profile is already complete
          router.push('/');
        }
      } catch (error) {
        console.error('Error checking profile completion:', error);
        alert('An error occurred. Redirecting...');
        router.push('/');
      }
    };

    checkProfileCompletion();
  }, [user, contextLoading, router]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    avatar.current = e.target.files?.[0] || null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;

    try {
      setLoading(true);

      // Upload avatar if provided and update context
      if (avatar.current) {
        await uploadUserAvatar(user.uid, avatar.current, updateUser);
      }

      // Update profile and context
      await updateUserProfile(user.uid, username, name, updateUser);

      router.push('/');
    } catch (error: any) {
      console.error('Profile update failed:', error);
      toast.error('Profile update failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  const checkUsernameAvailability = async (username: string) => {

    // Check username format
    const usernameRegex = /^[a-zA-Z0-9_]{1,20}$/;
    if (!usernameRegex.test(username)) {
      setUsernameState('taken'); // Use 'taken' to indicate invalid format
      return;
    }

    setUsernameState('checking');
    try {
      const available = await isUsernameAvailable(username);
      setUsernameState(available ? 'available' : 'taken');
    } catch (error) {
      console.error('Error checking username availability:', error);
      setUsernameState('checking');
    }
  };

  // Show loading while user context is loading
  if (contextLoading) {
    return (
      <SudokuLoading message="Loading user data..." size="md" fullScreen={true} />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl px-6 py-8 sm:px-8 sm:py-10 border border-gray-200 dark:border-gray-700"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Complete Your Profile
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Set up your account to get started
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-3 sm:p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                placeholder="Choose a unique username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (e.target.value.trim()) {
                    checkUsernameAvailability(e.target.value);
                  }
                }}
                required
                className="w-full p-3 sm:p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
              <div className="mt-2 min-h-[20px]">
                {username.trim() && (
                  <>
                    {usernameState === 'checking' && (
                      <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Checking availability...
                      </p>
                    )}
                    {usernameState === 'available' && (
                      <p className="text-green-600 dark:text-green-400 text-sm flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                        Username is available!
                      </p>
                    )}
                    {usernameState === 'taken' && (
                      <p className="text-red-600 dark:text-red-400 text-sm flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                        </svg>
                        Username is already taken
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Profile Picture (Optional)
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-3 sm:p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-600 dark:file:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
              </div>
              {avatar.current && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  ✓ File selected: {avatar.current.name}
                </p>
              )}
              {avatarURL.current && !avatar.current && (
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  ✓ Using existing profile picture
                </p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Upload a new profile picture (JPG, PNG, GIF)
              </p>
            </div>

          </div>

          <button
            type="submit"
            disabled={loading || usernameState === 'taken'}
            className="w-full mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold py-3 sm:py-4 px-4 rounded-xl transition duration-300 transform hover:scale-[1.02] disabled:hover:scale-100 shadow-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving Profile...
              </span>
            ) : (
              'Complete Profile'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
