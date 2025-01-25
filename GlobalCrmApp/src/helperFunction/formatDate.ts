export const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const offset = date.getTimezoneOffset() * 60000; 
  const localDate = new Date(date.getTime() - offset); 
  return localDate.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour12: false,
  });
};

export const formatLocalTime = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, 
  };
  return new Date(dateString).toLocaleTimeString(undefined, options);
};

export const formatTime = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const offset = date.getTimezoneOffset() * 60000; 
  const localDate = new Date(date.getTime() - offset); 
  return localDate.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

export const formatDateTime = (dateTimeString: string): string => {
  const date = new Date(dateTimeString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const calculateRemainingTime = (endTimeString: string): string => {
  const endTime = new Date(endTimeString).getTime();
  const currentTime = new Date().getTime();
  const remainingTime = endTime - currentTime;

  if (remainingTime <= 0) {
    return '00:00:00';
  }

  const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
  const seconds = Math.floor((remainingTime / 1000) % 60);

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};