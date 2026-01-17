import { ref, readonly, computed } from "vue";
import { useApi } from "./useApi";

const {
  login: apiLogin,
  adminRegister,
  verificationResponse,
  createTenant: apiCreateTenant,
  getUser: apiGetUser,
} = useApi();

const token = ref<string | null>(null);
const tempToken = ref<string | null>(null);
const tempEmail = ref<string | null>(null);
const tenantId = ref<string | null>(null);
const isAuthenticated = ref(false);

const loadToken = async () => {
  if (process.client) {
    const stored = localStorage.getItem("auth_token");
    token.value = stored;
    console.log("loadToken - from localStorage:", stored);
  }
  isAuthenticated.value = !!token.value;
  if (token.value) {
    try {
      const parts = token.value.split(".");
      const payloadBase64 = parts.length === 3 ? parts[1] : "";
      if (payloadBase64) {
        const payload = JSON.parse(atob(payloadBase64));
        const userId = payload.id;
        console.log("User ID extracted:", userId);
        if (userId) {
          const userResponse = (await apiGetUser(token.value, userId)) as any;
          console.log("User response:", userResponse);
          if (userResponse.success && userResponse.data?.tenantID) {
            tenantId.value = userResponse.data.tenantID;
            console.log("tenantId from API:", tenantId.value);
          }
        }
      }
    } catch (e) {
      console.error("Error loading token:", e);
      tenantId.value = null;
    }
  }
};

const saveToken = (newToken: string) => {
  token.value = newToken;
  isAuthenticated.value = true;
  if (process.client) {
    localStorage.setItem("auth_token", newToken);
  }
};

const clearToken = () => {
  token.value = null;
  tempToken.value = null;
  tenantId.value = null;
  isAuthenticated.value = false;
  if (process.client) {
    localStorage.removeItem("auth_token");
  }
};

const login = async (username: string, password: string) => {
  try {
    const response = (await apiLogin({ username, password })) as any;
    console.log("Login response:", response);
    if (response.success) {
      const tokenValue =
        response.data?.token || response.token || response.data;
      console.log("Saving token:", tokenValue);
      saveToken(tokenValue);
      await loadToken();
      return { success: true };
    } else {
      return { success: false, message: response.message };
    }
  } catch (error) {
    return { success: false, message: "Error de conexión" };
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
    const response = (await adminRegister(data)) as any;
    if (response.success) {
      const tokenValue =
        response.data?.token || response.token || response.data;
      console.log("Saving token:", tokenValue);
      saveToken(tokenValue);
      tempToken.value = response.data.token;
      tempEmail.value = data.email;
      return {
        success: true,
        message: response.message,
        token: response.data.token,
        email: data.email,
      };
    } else {
      return { success: false, message: response.message };
    }
  } catch (error) {
    return { success: false, message: "Error de conexión" };
  }
};

const verify = async (token: string, code: string) => {
  try {
    const response = (await verificationResponse(token, code)) as any;
    console.log(response);
    if (response.success) {
      tempEmail.value = null;
      return { success: true, message: response.message };
    } else {
      return { success: false, message: response.message };
    }
  } catch (error) {
    return { success: false, message: "Error de conexión" };
  }
};

const createTenant = async (token: string, data: {
  name: string;
  slug: string;
  category: string;
  businessInfo: string;
  agentPrompt: string;
}) => {
  try {
    const response = (await apiCreateTenant(token, data)) as any;
    if (response.success) {
      clearToken();
      return { success: true, message: response.message, data: response.data };
    } else {
      return { success: false, message: response.message };
    }
  } catch (error) {
    return { success: false, message: "Error de conexión" };
  }
};

const logout = () => {
  clearToken();
};

export const useAuth = () => {
  loadToken();
  return {
    token: readonly(computed(() => token.value || tempToken.value)),
    tempEmail: readonly(computed(() => tempEmail.value)),
    tenantId: readonly(computed(() => tenantId.value)),
    isAuthenticated: readonly(isAuthenticated),
    login,
    register,
    verify,
    createTenant,
    logout,
  };
};
