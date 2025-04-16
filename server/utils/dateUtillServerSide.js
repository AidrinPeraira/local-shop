export const getUTCDateTime = () => {
    return new Date().toISOString();
  };
  
  export const convertToUTCDateTime = (date) => {
    return new Date(date).toISOString();
  };