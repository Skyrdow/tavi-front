const API_BASE_URL = "https://llm-cm-agent-backend.onrender.com";

export const useApi = () => {
  const adminRegister = async (data: {
    names: string;
    lastnames: string;
    rut: string;
    dv: string;
    email: string;
  }) => {
    return await $fetch("/api/v1/admin-register", {
      baseURL: API_BASE_URL,
      method: "POST",
      body: data,
    });
  };

  const verificationResponse = async (token: string, code: string) => {
    return await $fetch("/api/v1/verification-response", {
      baseURL: API_BASE_URL,
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: { code },
    });
  };

  const createTenant = async (
    token: string,
    data: {
      name: string;
      slug: string;
      category: string;
      businessInfo: string;
      agentPrompt: string;
    },
  ) => {
    return await $fetch("/api/v1/tenants", {
      baseURL: API_BASE_URL,
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        Name: data.name,
        Description: data.businessInfo,
        Slug: data.slug,
        Category: data.category,
        AgentPrompt: data.agentPrompt,
      },
    });
  };

  const login = async (data: { username: string; password: string }) => {
    return await $fetch("/api/v1/login", {
      baseURL: API_BASE_URL,
      method: "POST",
      body: data,
    });
  };

  const getUser = async (token: string, userId: string) => {
    return await $fetch(`/api/v1/users/${userId}`, {
      baseURL: API_BASE_URL,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const getComments = async (token: string, tenantId: string) => {
    return await $fetch(`/api/v1/comments/${tenantId}`, {
      baseURL: API_BASE_URL,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const geminiRequest = async (prompt: string) => {
    return await $fetch("/api/v1/geminiRequest", {
      baseURL: API_BASE_URL,
      method: "POST",
      body: { prompt },
    });
  };

  return {
    adminRegister,
    verificationResponse,
    createTenant,
    login,
    getUser,
    getComments,
    geminiRequest,
  };
};
