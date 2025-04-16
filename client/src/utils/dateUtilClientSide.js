export const formatLocalDateTime = (utcDateTime) => {
  return new Date(utcDateTime).toLocaleString();
};

export const formatLocalDate = (utcDateTime) => {
  return new Date(utcDateTime).toLocaleDateString();
};

export const formatLocalTime = (utcDateTime) => {
  return new Date(utcDateTime).toLocaleTimeString();
};

// Custom formatter for specific formats
export const formatCustomDateTime = (utcDateTime, options) => {
  return new Date(utcDateTime).toLocaleString(undefined, options);
};
