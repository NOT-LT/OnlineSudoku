// app/login/page.tsx
'use client';

import { useState } from 'react';
import { signIn } from '@/lib/authFunctions';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const {userAuth, user} = await signIn(email, password);
      if (!user.completeProfile) {
        router.push(`/profile?uid=${user.uid}`);
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed.');
      toast.error("Login failed: " + err.message.replace("Firebase:", ""));
      console.error('Login failed:', err)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-50 border border-gray-200 shadow-lg rounded-xl px-10 py-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
