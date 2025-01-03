export const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const offset = date.getTimezoneOffset() * 60000; // Get the timezone offset in milliseconds
  const localDate = new Date(date.getTime() - offset); // Adjust the date by the offset
  return localDate.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour12: false,
  });
};


export const formatTime = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const offset = date.getTimezoneOffset() * 60000; // Get the timezone offset in milliseconds
  const localDate = new Date(date.getTime() - offset); // Adjust the date by the offset
  return localDate.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};