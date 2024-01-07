export const removeTrailingSlash = (url: string | URL) => {
  return url.toString().replace(/\/+$/, '');
};
