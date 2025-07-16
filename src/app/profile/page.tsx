// app/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { updateUserProfile, uploadUserAvatar } from '@/lib/authFunctions';

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const uid = searchParams.get('uid');
  const router = useRouter();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!uid) {
      alert('No UID found. Redirecting...');
      router.push('/');
    }
  }, [uid, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uid) return;
    try {
      setLoading(true);
      if (avatar) await uploadUserAvatar(uid, avatar);
      await updateUserProfile(uid, username, name);
      router.push('/');
    } catch (error) {
      alert('Profile update failed: ' + error);
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
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Complete Your Profile</h2>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setAvatar(e.target.files?.[0] || null)}
          className="w-full p-3 mb-6 border border-gray-300 rounded-lg"
        />
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
