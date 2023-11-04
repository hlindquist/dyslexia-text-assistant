export const getTimeInMilliseconds = () => {
  const now = new Date();
  return `${now.toLocaleTimeString('en-US', {
    hour12: false,
  })}.${now.getMilliseconds()}`;
};
