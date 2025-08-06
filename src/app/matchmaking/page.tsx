'use client';
import { useUser } from '@/context/userContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SudokuLoading from '@/components/SudokuLoading';

export default function MatchmakingPage() {
    const { user, loading } = useUser();
    const router = useRouter();

    // Show loading state immediately
    if (loading) {
        return <SudokuLoading message="Loading user data..." size="md" fullScreen={true} />;
    }

    // Redirect if not authenticated (optional)
    if (!user) {
        router.push('/login');
        return null;
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl mb-4">Looking for an opponent...</h1>
            <p className="text-gray-600">Welcome, {user.username || user.name}!</p>
        </div>
    );
}
