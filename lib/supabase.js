// lib/supabase.js
import { AppState } from 'react-native';
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

// Adaptador para guardar la sesión de forma segura en el móvil
const ExpoSecureStoreAdapter = {
  getItem: (key) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key, value) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key) => {
    SecureStore.deleteItemAsync(key);
  },
};

// Lee credenciales de Constants.expoConfig.extra (configurado en app.config.js)
// En producción, estos valores serán inyectados por EAS secrets
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.SUPABASE_URL;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase credentials not configured. Check app.config.js or environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Lógica para refrescar la sesión si la app pasa a segundo plano
let appStateSubscription;

appStateSubscription = AppState.addEventListener('change', (state) => {
  if (state === 'active' && supabase.auth?.startAutoRefresh) {
    supabase.auth.startAutoRefresh();
  } else if (state !== 'active' && supabase.auth?.stopAutoRefresh) {
    supabase.auth.stopAutoRefresh();
  }
});
