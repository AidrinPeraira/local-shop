const apiURL = import.meta.env.VITE_API_BASE_URL

const configuration = {
    baseURL: apiURL, // API Base URL
    featureFlags: {
      enableNewFeature: true, // Toggle features easily
    },
  };
  
  
  export {configuration};
  
