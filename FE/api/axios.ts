const IS_SERVER = typeof window === "undefined";
const axiosModule = IS_SERVER
  ? await import("./axios-server")
  : await import("./axios-client");

const axios = axiosModule.default;

export const endpoints = {
  auth: {
    login: "/auth/sign-in/email",
    register: "/auth/sign-up/email",
    signout: "/auth/sign-out",
    getSession: "/auth/get-session",
    isAuthenticated: "/auth/ok",
  },
  subscription: {
    getSubscription: "/payments/my-subscription",
    checkout: "/payments/checkout",
  },
  workflows: {
    all: "/workflows",
    single: (workflowId: string | number) => `/workflows/${workflowId}`,
    updateName: (workflowId: string) => `/workflows/${workflowId}/name`,
    execute: (workflowId: string) => `/workflows/${workflowId}/execute`,
  },
  ai: {
    geminiAvailableModels: "/ai/my-google-models",
    openAiAvailableModels: "/ai/my-openai-models",
  },
  credentials: {
    all: "/credentials",
    listAll: "/credentials/all",
    single: (credentialId: string | number) => `/credentials/${credentialId}`,
  },
  appConnections: {
    getMyConnections: "/app-connections/my-connections",
  },
  integrations: {
    discord: {
      callback: (workflowId: string) =>
        `/app-connections/DISCORD/connect?workflowId=${workflowId}`,
      servers: (connectionId: string) =>
        `/app-connections/discord/connections/${connectionId}/servers`,
      channels: (serverId: string) =>
        `/app-connections/discord/servers/${serverId}/channels`,
      installBot: (workflowId: string) =>
        `/app-connections/discord/install-bot?workflowId=${workflowId}`,
    },
    slack: {
      callback: (workflowId: string) =>
        `/app-connections/SLACK/connect?workflowId=${workflowId}`,
      servers: (connectionId: string) =>
        `/app-connections/discord/connections/${connectionId}/servers`,
      channels: (serverId: string) =>
        `/app-connections/discord/servers/${serverId}/channels`,
      installBot: (workflowId: string) =>
        `/app-connections/discord/install-bot?workflowId=${workflowId}`,
    },
  },
};

export default axios;
