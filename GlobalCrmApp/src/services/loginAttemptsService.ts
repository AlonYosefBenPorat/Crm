import axios from 'axios';

const LoginAttemptsBaseURL = 'https://localhost:7003/api/LoginAttempts';

const getLoginAttempts = async () => {
  const token = JSON.parse(localStorage.getItem('JwtToken') || '{}').token;

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: LoginAttemptsBaseURL,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  return axios.request(config)
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching login attempts:', error);
      throw error;
    });
};

export const loginAttemptsService = {
  getLoginAttempts,
};