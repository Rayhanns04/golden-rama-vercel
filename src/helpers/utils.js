export const truncateString = (str, maxLength) => {
  if (str.length > maxLength) {
    // Truncate the string and add ellipsis (...) at the end
    return str.substring(0, maxLength) + "...";
  }
  return str;
};
