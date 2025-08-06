'use client';
import { useUser } from '@/context/userContext';
import { useRouter } from 'next/navigation';
import { signOut } from '@/lib/authFunctions';
import Link from 'next/link';
import SudokuLoading from './SudokuLoading';

export default function HomeClient() {
    const router = useRouter();
    const userContext = useUser();
    const { user, loading } = userContext || { user: null, loading: true };



    const handleSignOut = async () => {
        try {
            await signOut();
            console.log('User signed out successfully');
        } catch (error: any) {
            console.error('Error signing out:', error);
            // Handle ad blocker or network issues
            if (error?.message?.includes('ERR_BLOCKED_BY_CLIENT')) {
                alert('Network connection blocked. Please disable ad blocker or try a different browser.');
            }
        }
    };
    console.log('User context:', user);

    if (loading) {
        return <SudokuLoading message="Loading user data..." size="sm" />;
    }

    return (
        <>
            {/* User Status and Navigation */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    {user ? `Welcome, ${user?.username || user?.name || 'Guest'}!` : 'Welcome, Guest!'}
                </div>
                <div className="space-x-4">
                    {user ? (
                        <button
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
                            onClick={handleSignOut}
                        >
                            Logout
                        </button>
                    ) : (
                        <div className="space-x-2">
                            <Link
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
                                href="/login"
                            >
                                Login
                            </Link>
                            <Link
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
                                href="/register"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mb-8">
                <Link prefetch
                    href="/matchmaking"
                    className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white"
                >
                    Find Match
                </Link>


                {!user && (
                    <p className="mt-2 text-sm text-gray-600">
                        Create an account to save your progress and compete with other players!
                    </p>
                )}
            </div>
        </>
    );
}
