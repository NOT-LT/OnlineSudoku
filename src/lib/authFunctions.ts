import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup,
  getAdditionalUserInfo 
} from 'firebase/auth';
import { auth, db, storage } from './firebase';
import { doc, setDoc, serverTimestamp, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const registerUser = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Step 2: Create Firestore document
  const userDoc = {
    uid: user.uid,
    email: user.email,
    rating: 0,
    avatar: '',
    createdAt: serverTimestamp(),
    currentGameId: null,
    stats: {
      gamesPlayed: 0,
      gamesWon: 0,
      gamesLost: 0
    },
    completeProfile: false,
  };

  await setDoc(doc(db, 'users', user.uid), userDoc);

  return user;
};

export async function uploadUserAvatar(uid: string, file: File) {
  try {
    const avatarRef = ref(storage, `avatars/${uid}`);

    // Upload the file to Storage
    await uploadBytes(avatarRef, file);

    // Get the download URL
    const downloadURL = await getDownloadURL(avatarRef);

    // Save the URL in Firestore user doc
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, { avatarURL: downloadURL });

    return downloadURL;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw error;
  }
}

export const updateUserProfile = async (uid: string, username: string, name: string) => {
  if (!uid) throw new Error('User ID is required');
  const userDoc = {
    username,
    name,
    updatedAt: serverTimestamp(),
    avatar: '',
    isOnline: true,
    completeProfile: true
  };
  await setDoc(doc(db, 'users', uid), userDoc, { merge: true });
  return userDoc;
}

export const signIn = async (email: string, password: string) => {
  const userCredentials =  await signInWithEmailAndPassword(auth, email, password);
  const user = userCredentials.user;
  if (!user) {
    throw new Error('User not found');
  }
  await setDoc(doc(db, 'users', user.uid), {
    isOnline: true,
  }, { merge: true });
  return user;
}

export const signOut = async () => {
  await auth.signOut();
  await setDoc(doc(db, 'users', auth.currentUser?.uid || ''), {
    isOnline: false,
  }, { merge: true });
  return true;
};

// New Google authentication functions

/**
 * Sign in with Google popup
 * @returns User object with additional completeProfile property
 */
export const signInWithGoogle = async () => {
  try {
    const googleProvider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if this is a new user
    const { isNewUser } = getAdditionalUserInfo(result) || { isNewUser: false };
    
    // If new user, create a document for them
    if (isNewUser) {
      const userDoc = {
        uid: user.uid,
        email: user.email,
        name: user.displayName || '',
        avatar: user.photoURL || '',
        avatarURL: user.photoURL || '',
        rating: 0,
        createdAt: serverTimestamp(),
        currentGameId: null,
        stats: {
          gamesPlayed: 0,
          gamesWon: 0,
          gamesLost: 0
        },
        completeProfile: false,  // They still need to pick a username
        isOnline: true,
      };
      
      await setDoc(doc(db, 'users', user.uid), userDoc);
      return { ...user, completeProfile: false }; 
    } else {
      // Existing user - update online status
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { isOnline: true });
      
      // Check if they have completed their profile
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();
      
      return { 
        ...user, 
        completeProfile: userData?.completeProfile || false 
      };
    }
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
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
    const userDoc = {
      uid: user.uid,
      email: user.email,
      name: user.displayName || '',
      avatar: user.photoURL || '',
      avatarURL: user.photoURL || '',
      rating: 0,
      createdAt: serverTimestamp(),
      currentGameId: null,
      stats: {
        gamesPlayed: 0,
        gamesWon: 0,
        gamesLost: 0
      },
      completeProfile: false,  // They still need to pick a username
      isOnline: true,
    };
    
    await setDoc(doc(db, 'users', user.uid), userDoc, { merge: true });
    return user;
  } catch (error) {
    console.error('Error registering with Google:', error);
    throw error;
  }
};