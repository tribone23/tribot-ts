export const isValidUrl = (urlString: string) => {
  const urlPattern = new RegExp('^.*https://(?:m|www|vm|vt)?\\.?tiktok\\.com/');
  return !!urlPattern.test(urlString);
};
