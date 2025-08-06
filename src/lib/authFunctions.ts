import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo
} from 'firebase/auth';
import { auth, db, storage } from './firebase';
import { doc, setDoc, serverTimestamp, updateDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const registerUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('User registered:', userCredential);
    const user = userCredential.user;

    // Step 2: Create Firestore document
    const userDoc = {
      uid: user.uid,
      email: user.email,
      rating: 0,
      avatar: '',
      createdAt: serverTimestamp(),
      currentGameId: "-1",
      stats: {
        gamesPlayed: 0,
        gamesWon: 0,
        gamesLost: 0
      },
      completeProfile: false,
    };

    await setDoc(doc(db, 'users', user.uid), userDoc);

    return user;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export async function uploadUserAvatar(
  uid: string,
  file: File,
  updateUserContext?: (updates: any) => void
) {
  try {
    // Security checks
    if (!uid) throw new Error('User ID is required');
    if (!auth.currentUser || auth.currentUser.uid !== uid) {
      throw new Error('401 Unauthorized - User must be authenticated');
    }

    // Validate file
    if (!file) throw new Error('File is required');

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('File size must be less than 5MB');
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('File must be an image (JPEG, PNG, GIF, or WebP)');
    }

    const avatarRef = ref(storage, `avatars/${uid}`);

    // Upload the file to Storage
    await uploadBytes(avatarRef, file);

    // Get the download URL
    const downloadURL = await getDownloadURL(avatarRef);

    // Save the URL in Firestore user doc
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, {
      avatarURL: downloadURL,
      avatar: downloadURL // Update both fields for compatibility
    });

    // Update user context if callback provided
    if (updateUserContext) {
      updateUserContext({
        avatarURL: downloadURL,
        avatar: downloadURL,
      });
    }

    return downloadURL;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw error;
  }
}

export const updateUserProfile = async (
  uid: string,
  username: string,
  name: string,
  updateUserContext?: (updates: any) => void
) => {
  if (!uid) throw new Error('User ID is required');
  if (!username || !name) throw new Error('Username and name are required');

  // Validate current user authentication
  if (!auth.currentUser || auth.currentUser.uid !== uid) {
    throw new Error('401 Unauthorized - User must be authenticated');
  }

  // Validate username format (3-20 characters, alphanumeric and underscore only)
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  if (!usernameRegex.test(username.trim())) {
    throw new Error('Username must be 3-20 characters and contain only letters, numbers, and underscores');
  }

  // Validate name (2-50 characters, allow letters, spaces, hyphens)
  const nameRegex = /^[a-zA-Z0-9\s\-]{2,50}$/;
  if (!nameRegex.test(name.trim())) {
    throw new Error('Name must be 2-50 characters and contain only letters, spaces, and hyphens');
  }

  // Check if username is available (skip if it's the current user's username)
  const currentUserDoc = await getDoc(doc(db, 'users', uid));
  const currentUsername = currentUserDoc.exists() ? currentUserDoc.data().username : null;

  if (currentUsername !== username.trim()) {
    const isAvailable = await isUsernameAvailable(username.trim());
    if (!isAvailable) {
      throw new Error('Username is already taken');
    }
  }

  const userDoc = {
    username: username.trim(),
    name: name.trim(),
    updatedAt: serverTimestamp(),
    isOnline: true,
    completeProfile: true
  };

  await setDoc(doc(db, 'users', uid), userDoc, { merge: true });

  // Update user context if callback provided
  if (updateUserContext) {
    updateUserContext({
      username: username.trim(),
      name: name.trim(),
      completeProfile: true,
      updatedAt: new Date(), // Use actual Date for immediate UI update
    });
  }

  return userDoc;
}

export const isUsernameAvailable = async (username: string) => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('username', '==', username));
  const querySnapshot = await getDocs(q);
  return querySnapshot.empty; // Returns true if username is available
}



export const signIn = async (email: string, password: string) => {
  const userCredentials = await signInWithEmailAndPassword(auth, email, password);
  const userAuth = userCredentials.user;
  console.log('User signed in:', userAuth);
  if (!userAuth) {
    throw new Error('User not found');
  }
  const user = await getDoc(doc(db, 'users', userAuth.uid)).then(doc => {
    if (!doc.exists()) {
      throw new Error('User document not found');
    }
    return doc.data() as User;
  });
  await setDoc(doc(db, 'users', user.uid), {
    isOnline: true,
  }, { merge: true });

  console.log('User data:', auth.currentUser);
  return { userAuth, user };
}

export const signOut = async () => {
  const currentUid = auth.currentUser?.uid; // Save UID before signOut

  if (currentUid) {
    // Update status before signing out
    await setDoc(doc(db, 'users', currentUid), {
      isOnline: false,
    }, { merge: true });
  }

  await auth.signOut();
  return true;
};
// New Google authentication functions

/**
 * Sign in with Google popup
 * @returns User object with additional completeProfile property
 */
export const signInWithGoogle = async () => {
  try {
    console.log('Starting Google sign-in process...');

    const googleProvider = new GoogleAuthProvider();

    // Add these scopes if needed
    googleProvider.addScope('email');
    googleProvider.addScope('profile');

    // Force account selection
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });

    console.log('Calling signInWithPopup...');
    const result = await signInWithPopup(auth, googleProvider);
    console.log('Sign-in successful:', result);

    const userAuth = result.user;
    const additionalUserInfo = getAdditionalUserInfo(result);
    const isNewUser = additionalUserInfo?.isNewUser || false;

    if (isNewUser) {
      const userDoc = {
        uid: userAuth.uid,
        email: userAuth.email,
        name: userAuth.displayName || '',
        avatar: userAuth.photoURL || '',
        avatarURL: userAuth.photoURL || '',
        rating: 0,
        createdAt: serverTimestamp(),
        currentGameId: '-1',
        stats: {
          gamesPlayed: 0,
          gamesWon: 0,
          gamesLost: 0,
        },
        completeProfile: false,
        isOnline: true,
      };

      await setDoc(doc(db, 'users', userAuth.uid), userDoc);
      console.log('New user document created');
      return { userAuth, user: userDoc };
    } else {
      const userDocRef = doc(db, 'users', userAuth.uid);
      await updateDoc(userDocRef, { isOnline: true });

      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        throw new Error('User document not found');
      }

      const userData = userDoc.data();
      console.log('Existing user signed in');
      return { userAuth, user: userData };
    }
  } catch (error: any) {
    console.error('Detailed error:', error);

    if (error.code === 'auth/popup-blocked') {
      throw new Error('Popup was blocked. Please allow popups for this site.');
    } else if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in was cancelled.');
    } else if (error.code === 'auth/cancelled-popup-request') {
      throw new Error('Another popup is already open.');
    } else {
      throw new Error(`Sign-in failed: ${error.message}`);
    }
  }
};

export const hasCompletedProfile = async (uid: string) => {
  if (!uid) throw new Error('User ID is required');
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (!userDoc.exists()) {
    throw new Error('User document not found');
  }
  const userData = userDoc.data() as User;
  return userData.completeProfile || false;
};

/**
 * Register a new user with Google (for explicit registration flow)
 * @returns User object
 */
export const registerWithGoogle = async () => {
  try {
    const googleProvider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Create a new user document regardless of whether they've signed in before
    const userDoc: User = {
      username: '', // They need to set this later
      uid: user.uid,
      email: user.email,
      name: user.displayName || '',
      avatar: user.photoURL || '',
      avatarURL: user.photoURL || '',
      rating: 0,
      createdAt: serverTimestamp(),
      currentGameId: "-1",
      stats: {
        gamesPlayed: 0,
        gamesWon: 0,
        gamesLost: 0
      },
      completeProfile: false,  // They still need to pick a username
      isOnline: true,
    };

    const uncompletedFields = Object.entries(userDoc).map(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        return key;
      }
    });


    await setDoc(doc(db, 'users', user.uid), userDoc, { merge: true });
    console.log('User registered with Google:', user);

    return { user, userDoc, uncompletedFields };
  } catch (error) {
    console.error('Error registering with Google:', error);
    throw error;
  }
};