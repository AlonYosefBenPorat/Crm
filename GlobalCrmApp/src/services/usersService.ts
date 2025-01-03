import axios from 'axios';

const UsersBaseURL = 'https://localhost:7003/api/Users';

const getUsers = () => {
  const token = JSON.parse(localStorage.getItem('JwtToken') || '{}').token;

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: UsersBaseURL,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  return axios.request(config)
    .then(response => response.data)
    .catch(error => {
      console.error(error);
      throw error;
    });
};


export const getUserById = async (userId: string) => {
  const token = JSON.parse(localStorage.getItem('JwtToken') || '{}').token;

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${UsersBaseURL}/${userId}`,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

const deleteUser = async (userId: string) => {
  const token = JSON.parse(localStorage.getItem('JwtToken') || '{}').token;
  const config = {
    method: 'delete',
    maxBodyLength: Infinity,
    url: `${UsersBaseURL}/${userId}`,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  return axios.request(config)
    .then(response => response.data)
    .catch(error => {
      console.error(error);
      throw error;
    });
};

const addUser = async (userData: any) => {
  const token = JSON.parse(localStorage.getItem('JwtToken') || '{}').token;
  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${UsersBaseURL}`,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    data: userData,
  };

  return axios.request(config)
    .then(response => response.data)
    .catch(error => {
      console.error(error);
      throw error;
    });
};

const resetUserPassword = async (userId: string, newPassword: string) => {
  const token = JSON.parse(localStorage.getItem('JwtToken') || '{}').token;
  const data = JSON.stringify({
    Password: newPassword,
  });

  const config = {
    method: 'patch',
    maxBodyLength: Infinity,
    url: `${UsersBaseURL}/${userId}/reset-password`,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    data: data,
  };

  return axios.request(config)
    .then(response => response.data)
    .catch(error => {
      console.error('Error:', error.response ? error.response.data : error.message);
      throw error;
    });
};

const updateUserStatus = async (userId: string, isEnabled: boolean) => {
  const token = JSON.parse(localStorage.getItem('JwtToken') || '{}').token;
  const data = JSON.stringify({
    IsEnabled: isEnabled,
  });

  const config = {
    method: 'patch',
    maxBodyLength: Infinity,
    url: `${UsersBaseURL}/${userId}/update-status`,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    data: data,
  };

  return axios.request(config)
    .then(response => response.data)
    .catch(error => {
      console.error('Error:', error.response ? error.response.data : error.message);
      throw error;
    });
};

const updateUserJobTitle = async (userId: string, jobTitle: string) => {
  const token = JSON.parse(localStorage.getItem('JwtToken') || '{}').token;
  const data = JSON.stringify({
    JobTitle: jobTitle,
  });

  const config = {
    method: 'patch',
    maxBodyLength: Infinity,
    url: `${UsersBaseURL}/${userId}/update-JobTitle`,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    data: data,
  };

  return axios.request(config)
    .then(response => response.data)
    .catch(error => {
      console.error('Error:', error.response ? error.response.data : error.message);
      throw error;
    });
};

const updateUserDetails = async (userId: string, userDetails: any) => {
  const token = JSON.parse(localStorage.getItem('JwtToken') || '{}').token;
  const config = {
    method: 'put',
    maxBodyLength: Infinity,
    url: `${UsersBaseURL}/${userId}`,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    data: userDetails,
  };

  return axios.request(config)
    .then(response => response.data)
    .catch(error => {
      console.error('Error:', error.response ? error.response.data : error.message);
      throw error;
    });
};



export const usersService = {
  getUsers,
  getUserById,
  addUser,
  resetUserPassword,
  deleteUser,
  updateUserStatus,
  updateUserJobTitle,
  updateUserDetails,
};