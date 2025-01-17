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
const supabaseUrl= "https://vmnsihopihdmvdjtdssu.supabase.co"
const supabaseAnonKey=  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtbnNpaG9waWhkbXZkanRkc3N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5MDI2MDIsImV4cCI6MjA1MjQ3ODYwMn0.BbZ_IKD_x3-vHl4V0NIpwmd8BC-RHdOEwBVGDMLnC-k"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});