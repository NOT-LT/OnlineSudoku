// lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import type { Analytics } from 'firebase/analytics';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize app safely (only once)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Core services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Analytics: export getter function instead of a possibly-null variable
let analytics: Analytics | null = null;

const getAnalyticsIfSupported = async () => {
  if (typeof window !== 'undefined') {
    const supported = await isSupported();
    if (supported) {
      analytics = getAnalytics(app);
    }
  }
  return analytics;
};

export { app, db, auth, storage, getAnalyticsIfSupported };
