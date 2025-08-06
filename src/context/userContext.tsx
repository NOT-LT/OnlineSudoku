'use client';
import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { auth } from '@/lib/firebase';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface UserContextType {
    user: User | null;
    loading: boolean;
    updateUser: (updates: Partial<User>) => void;
}

const UserContext: React.Context<UserContextType | null> = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const userCache = useRef<any>(null);
    const initialized = useRef(false);

    // Partial makes it easier to update only specific fields of the user object, as it makes all fields optional
    const updateUser = (updates: Partial<User>) => {
        setUser((prevUser: any) => {
            if (!prevUser) return null;
            const updatedUser = { ...prevUser, ...updates };
            userCache.current = updatedUser; // Update cache
            return updatedUser;
        });
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
            // Only fetch once per session
            if (initialized.current && userCache.current && authUser?.uid === userCache.current?.uid) {
                console.log('Using cached user data');
                setUser(userCache.current);
                setLoading(false);
                return;
            }

            if (authUser) {
                try {
                    setLoading(true);
                    const userDoc = await getDoc(doc(db, 'users', authUser.uid));
                    if (userDoc.exists()) {
                        const userData = { ...authUser, ...userDoc.data() };
                        setUser(userData);
                        userCache.current = userData; // Cache it
                    } else {
                        setUser(null);
                        userCache.current = null;
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    setUser(null);
                } finally {
                    setLoading(false);
                    initialized.current = true;
                }
            } else {
                setUser(null);
                userCache.current = null;
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <UserContext.Provider value={{ user, loading, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};