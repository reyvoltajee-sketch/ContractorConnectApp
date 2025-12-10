// lib/supabase.js
// @ts-check
import { AppState } from 'react-native';
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

// Adaptador para guardar la sesi�n de forma segura en el m�vil
const ExpoSecureStoreAdapter = {
  /**
   * @param {string} key
   * @returns {Promise<string | null>}
   */
  getItem: /** @type {(key: string) => Promise<string | null>} */ (
    /** @param {string} key */
    (key) => {
      return SecureStore.getItemAsync(key);
    }
  ),
  /**
   * @param {string} key
   * @param {string} value
   * @returns {Promise<void>}
   */
  setItem: /** @type {(key: string, value: string) => Promise<void>} */ (
    /** @param {string} key @param {string} value */
    (key, value) => {
      return SecureStore.setItemAsync(key, value);
    }
  ),
  /**
   * @param {string} key
   * @returns {Promise<void>}
   */
  removeItem: /** @type {(key: string) => Promise<void>} */ (
    /** @param {string} key */
    (key) => {
      return SecureStore.deleteItemAsync(key);
    }
  ),
};

// Lee credenciales de Constants.expoConfig.extra (configurado en app.config.js)
// En producci�n, estos valores ser�n inyectados por EAS secrets
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.SUPABASE_URL;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase credentials not configured. Check app.config.js or environment variables.');
}

// Crear el cliente de Supabase
/** @type {import('@supabase/supabase-js').SupabaseClient} */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// L�gica para refrescar la sesi�n si la app pasa a segundo plano
AppState.addEventListener('change', (state) => {
  if (state === 'active' && supabase.auth?.startAutoRefresh) {
    supabase.auth.startAutoRefresh();
  } else if (state !== 'active' && supabase.auth?.stopAutoRefresh) {
    supabase.auth.stopAutoRefresh();
  }
});
