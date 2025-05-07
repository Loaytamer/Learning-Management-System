import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6rSkdPwnw5hmGDWXvR6WiMXDMFZlsaeg",
  authDomain: "learning-management-syst-75ab5.firebaseapp.com",
  databaseURL: "https://learning-management-syst-75ab5-default-rtdb.firebaseio.com",
  projectId: "learning-management-syst-75ab5",
  storageBucket: "learning-management-syst-75ab5.firebasestorage.app",
  messagingSenderId: "631082218092",
  appId: "1:631082218092:android:ef3c5bf568097c50bdde49"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
const database = getDatabase(app);
const storage = getStorage(app);

export { app, auth, database, storage };