'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersData: User[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();

          usersData.push({
            id: doc.id,
            uid: data.uid,
            username: data.username,
            email: data.email,
            avatarUrl: data.avatarUrl,
            createdAt: data.createdAt?.toDate().toISOString(), // convert Firestore Timestamp to string
            lastLoginAt: data.lastLoginAt?.toDate().toISOString(),
            stats: data.stats,
            preferences: data.preferences,
            currentGameId: data.currentGameId,
          });
        });

        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>Loading users...</div>;

  return (
    <div>
      <h2>All Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <strong>{user.username}</strong> — {user.email} — {user.stats?.gamesPlayed || 0} games played
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersList;
