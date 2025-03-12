const apiURL = import.meta.env.VITE_API_BASE_URL;
const googleClientId = import.meta.env.VITE_GOGGLE_OAUTH_CLIENT_ID;

const configuration = {
  baseURL: apiURL, // API Base URL
  featureFlags: {
    enableNewFeature: true, // Toggle features easily
  },
};

const googleConfig = {
  web: {
    client_id: googleClientId,
  },
};

export { configuration, googleConfig };
