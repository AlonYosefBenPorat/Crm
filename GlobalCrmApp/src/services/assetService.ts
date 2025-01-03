import axios from 'axios';

const assetBaseUrl = 'https://localhost:7003/api/CustomerAsset';

const getAuthHeaders = () => {
  const token = JSON.parse(localStorage.getItem('JwtToken') || '{}').token;
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const getAssetData = async (customerId: string) => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${assetBaseUrl}/${customerId}/Asset`,
    headers: getAuthHeaders(),
  };

  console.log('Fetching asset data with config:', config); // Log the request configuration

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error('Error fetching asset data:', error.response);
    throw error;
  }
};

export const addAssetData = async (customerId: string, assetData: any) => {
  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${assetBaseUrl}/${customerId}/Asset`,
    headers: getAuthHeaders(),
    data: assetData,
  };

  console.log('Adding asset data with config:', config); // Log the request configuration

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error('Error adding asset data:', error.response); // Log the error response
    throw error;
  }
};

export const updateAssetData = async (customerId: string, assetId: string, assetData: any) => {
  const config = {
    method: 'put',
    maxBodyLength: Infinity,
    url: `${assetBaseUrl}/${customerId}/Asset/${assetId}`,
    headers: getAuthHeaders(),
    data: assetData,
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error('Error updating asset data:', error.response);
    throw error;
  }
};

export const deleteAssetData = async (customerId: string, assetId: string) => {
  const config = {
    method: 'delete',
    maxBodyLength: Infinity,
    url: `${assetBaseUrl}/${customerId}/Asset/${assetId}`,
    headers: getAuthHeaders(),
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error('Error deleting asset data:', error.response);
    throw error;
  }
};