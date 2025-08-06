import 'react-native-url-polyfill/auto';
import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
  },
};
const supabaseUrl= "https://txyckcckrizfdfsuuvrs.supabase.co"
const supabaseAnonKey=  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4eWNrY2Nrcml6ZmRmc3V1dnJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0Mjg3NjksImV4cCI6MjA3MDAwNDc2OX0.--OIeiQK1pDiF3rk_bdWZhJkHQvN6wuN0PJAamvpmFA"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});