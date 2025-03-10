import axios from 'axios';

const backupBaseUrl = 'https://localhost:7003/api/CustomerBackup';

const getAuthHeaders = () => {
  const token = JSON.parse(localStorage.getItem('JwtToken') || '{}').token;
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const getBackupData = async (customerId: string) => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${backupBaseUrl}/${customerId}/backup`,
    headers: getAuthHeaders(),
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error('Error fetching backup data:', error.response); 
    throw error;
  }
};

export const addBackupData = async (customerId: string, backupData: any) => {
  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${backupBaseUrl}/${customerId}/backup`,
    headers: getAuthHeaders(),
    data: backupData,
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error('Error adding backup data:', error.response);
    throw error;
  }
};

export const updateBackupData = async (customerId: string, backupId: string, backupData: any) => {
  const config = {
    method: 'put',
    maxBodyLength: Infinity,
    url: `${backupBaseUrl}/${customerId}/backup/${backupId}`,
    headers: getAuthHeaders(),
    data: backupData,
  };


  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error('Error updating backup data:', error.response); 
    throw error;
  }
};

export const deleteBackupData = async (customerId: string, backupId: string) => {
  const config = {
    method: 'delete',
    maxBodyLength: Infinity,
    url: `${backupBaseUrl}/${customerId}/backup/${backupId}`,
    headers: getAuthHeaders(),
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error('Error deleting backup data:', error.response); 
    throw error;
  }
};