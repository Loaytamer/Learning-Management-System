import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getDatabase,
  DatabaseReference,
  DataSnapshot,
  onValue,
  push,
  remove,
  off,
  update,
  ref,
  set,
  get,
  child,
} from "firebase/database";

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

// Initialize Auth
const auth = getAuth(app);

// Initialize Realtime Database
const database = getDatabase(app);

// Database connection status monitoring
const connectedRef = ref(database, ".info/connected");
onValue(connectedRef, (snap) => {
  if (snap.val() === true) {
    console.log("Connected to Firebase Realtime Database");
  } else {
    console.log("Disconnected from Firebase Realtime Database");
  }
});
// Function to initialize the database with the schema
export const initializeDatabase = async (): Promise<void> => {
  try {
    // Define the initial database schema based on provided types
    const initialData = {
      users: {},
      
    };

    // Check if the root path has data
    const rootRef = ref(database, "/");
    const snapshot = await get(rootRef);

    if (!snapshot.exists()) {
      // If no data exists, set the initial structure
      await set(rootRef, initialData);
      console.log("Database initialized with schema");
    } else {
      console.log("Database already initialized");
    }
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};
// Generate a unique ID for new items
export const generateId = (path: string): string => {
  const newRef = push(ref(database, path));
  return newRef.key!;
};

// Generic CRUD utility functions

export const readData = async <T>(path: string): Promise<T | null> => {
  try {
    const snapshot = await get(ref(database, path));
    return snapshot.val();
  } catch (error) {
    console.error(`Error reading data from ${path}:`, error);
    throw error;
  }
};
export const deleteData = async (path: string): Promise<void> => {
  try {
    await set(ref(database, path), null);
    console.log(`Data deleted at ${path}`);
  } catch (error) {
    console.error(`Error deleting data at ${path}:`, error);
    throw error;
  }
};

export const updateData = async <T>(
  path: string,
  data: Partial<T>
): Promise<void> => {
  try {
    await update(ref(database, path), data);
  } catch (error) {
    console.error(`Error updating data at ${path}:`, error);
    throw error;
  }
};

export const subscribeToData = <T>(
  path: string,
  callback: (data: T | null) => void,
  onError?: (error: Error) => void
): (() => void) => {
  const dataRef = ref(database, path);
  const onDataChange = (snapshot: DataSnapshot) => {
    const data = snapshot.val() as T | null;
    console.log(`Subscribed data from ${path}:`, data);
    callback(data);
  };
  onValue(dataRef, onDataChange, (error) => {
    console.error(`Error subscribing to ${path}:`, error);
    if (onError) {
      onError(error);
    }
  });
  return () => off(dataRef, 'value', onDataChange);
};

export const createData = async <T>(path: string, data: T): Promise<void> => {
  try {
    await set(ref(database, path), data);
    console.log(`Data set at ${path}:`, data);
  } catch (error) {
    console.error(`Error setting data at ${path}:`, error);
    throw error;
  }
};

export { database, ref, set, get, child, auth };
export type { DatabaseReference, DataSnapshot };
