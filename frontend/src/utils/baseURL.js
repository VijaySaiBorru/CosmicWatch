const getBaseUrl = () => {
  return import.meta.env.VITE_BASE_URL?.replace(/\/$/, "");
};
export default getBaseUrl;