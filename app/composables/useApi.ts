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

  const scheduleJob = async (
    token: string,
    action: string,
    data: any,
    scheduledAt: string,
  ) => {
    return await $fetch("/api/v1/jobs/", {
      baseURL: API_BASE_URL,
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        action: action,
        data: data,
        scheduledAt: scheduledAt,
      },
    });
  };

  const getJobsByTenantId = async (token: string) => {
    return await $fetch("/api/v1/jobs/", {
      baseURL: API_BASE_URL,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const updateJob = async (
    token: string,
    jobId: string,
    scheduledAt: string,
  ) => {
    return await $fetch(`/api/v1/jobs/${jobId}`, {
      baseURL: API_BASE_URL,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: { scheduledAt },
    });
  };

  const deleteJob = async (token: string, jobId: string) => {
    return await $fetch(`/api/v1/jobs/${jobId}`, {
      baseURL: API_BASE_URL,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const generateDescription = async (tenantId: string, imageUrl: string) => {
    return await $fetch("/api/v1/generate-description", {
      baseURL: API_BASE_URL,
      method: "POST",
      body: { tenantId: tenantId, imageUrl: imageUrl },
    });
  };

  const createPost = async (
    token: string,
    data: {
      title?: string;
      content: string;
      imageURL?: string;
    },
  ) => {
    return await $fetch("/api/v1/posts/", {
      baseURL: API_BASE_URL,
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
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
    scheduleJob,
    getJobsByTenantId,
    updateJob,
    deleteJob,
    generateDescription,
    createPost,
  };
};
