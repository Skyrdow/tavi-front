import { ref, readonly, computed } from 'vue';
import { useApi } from './useApi';

const { login: apiLogin, adminRegister, verificationResponse, createTenant: apiCreateTenant } = useApi();

const token = ref<string | null>(null);
const tempToken = ref<string | null>(null);
const isAuthenticated = ref(false);

const loadToken = () => {
  if (process.client) {
    token.value = localStorage.getItem('auth_token') || null;
  }
  isAuthenticated.value = !!token.value;
};

const saveToken = (newToken: string) => {
  token.value = newToken;
  isAuthenticated.value = true;
  if (process.client) {
    localStorage.setItem('auth_token', newToken);
  }
};

const clearToken = () => {
  token.value = null;
  tempToken.value = null;
  isAuthenticated.value = false;
  if (process.client) {
    localStorage.removeItem('auth_token');
  }
};

const login = async (username: string, password: string) => {
  try {
    const response = await apiLogin({ username, password }) as any;
    if (response.success) {
      saveToken(response.data.token);
      return { success: true };
    } else {
      return { success: false, message: response.message };
    }
  } catch (error) {
    return { success: false, message: 'Error de conexión' };
  }
};

const register = async (data: {
  names: string;
  lastnames: string;
  rut: string;
  dv: string;
  email: string;
}) => {
  try {
    const response = await adminRegister(data) as any;
    if (response.success) {
      tempToken.value = response.data.token;
      return { success: true, message: response.message, token: response.data.token };
    } else {
      return { success: false, message: response.message };
    }
  } catch (error) {
    return { success: false, message: 'Error de conexión' };
  }
};

const verify = async (code: string) => {
  if (!token.value) {
    return { success: false, message: 'Token no encontrado. Regístrate primero.' };
  }
  try {
    const response = await verificationResponse(token.value, code) as any;
    if (response.success) {
      // Keep token for creating tenant
      return { success: true, message: response.message };
    } else {
      return { success: false, message: response.message };
    }
  } catch (error) {
    return { success: false, message: 'Error de conexión' };
  }
};

const createTenant = async (data: { name: string; slug: string; category: string }) => {
  if (!token.value) {
    return { success: false, message: 'Token no encontrado. Verifícate primero.' };
  }
  try {
    const response = await apiCreateTenant(token.value, data) as any;
    if (response.success) {
      // After creating tenant, clear the token
      clearToken();
      return { success: true, message: response.message, data: response.data };
    } else {
      return { success: false, message: response.message };
    }
  } catch (error) {
    return { success: false, message: 'Error de conexión' };
  }
};

const logout = () => {
  clearToken();
};

export const useAuth = () => {
  loadToken();
  return {
    token: readonly(computed(() => token.value || tempToken.value)),
    isAuthenticated: readonly(isAuthenticated),
    login,
    register,
    verify,
    createTenant,
    logout,
  };
};