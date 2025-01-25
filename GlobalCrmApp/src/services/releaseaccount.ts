import axios from 'axios';

const AccountBaseURL = 'https://localhost:7003/api/Account';

const releaseLockedOutUsers = async () => {
  const token = JSON.parse(localStorage.getItem('JwtToken') || '{}').token;

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${AccountBaseURL}/locked-users`,
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const unlockUser = async (userId: string) => {
  const token = JSON.parse(localStorage.getItem('JwtToken') || '{}').token;
  const data = JSON.stringify({ userId });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${AccountBaseURL}/release-lockout`,
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    data: data,
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const lockUser = async (userId: string, lockoutDurationInMinutes: number) => {
  const token = JSON.parse(localStorage.getItem('JwtToken') || '{}').token;
  const data = JSON.stringify({ userId, lockoutDurationInMinutes });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${AccountBaseURL}/lock-user`,
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    data: data,
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getUserLockoutStatus = async (userId: string) => {
  const token = JSON.parse(localStorage.getItem('JwtToken') || '{}').token;

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${AccountBaseURL}/user-lockout-status/${userId}`,
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await axios.request(config);
 
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return { isLockedOut: false, lockoutEnd: '' };
    }
    console.error('Error fetching user lockout status:', error); 
    throw error;
  }
};


export { releaseLockedOutUsers, unlockUser, lockUser, getUserLockoutStatus };