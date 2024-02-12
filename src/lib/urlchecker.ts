export const isValidUrl = (urlString: string) => {
  const urlPattern = new RegExp(
    '^.*https://(?:m|www|vm)?\\.?tiktok\\.com/((?:.*\\b(?:(?:usr|v|embed|user|video)/|\\?shareId=|&item_id=)(\\d+))|w+)',
  );
  return !!urlPattern.test(urlString);
};
