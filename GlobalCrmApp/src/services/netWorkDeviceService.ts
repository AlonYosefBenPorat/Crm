import axios from 'axios';

const networkDeviceBaseUrl = 'https://localhost:7003/api/CustomerNetworkDevice';

const getAuthHeaders = () => {
  const token = JSON.parse(localStorage.getItem('JwtToken') || '{}').token;
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const getNetworkDeviceData = async (customerId: string) => {
  console.log('Customer ID:', customerId); // Log the customer ID

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${networkDeviceBaseUrl}/${customerId}/NetworkDevice`,
    headers: getAuthHeaders(),
  };

  console.log('Request Config:', config); // Log the request configuration

  try {
    const response = await axios.request(config);
    console.log(JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error('Error fetching network device data:', error.response); // Log the error response
    throw error;
  }
};

export const addNetworkDeviceData = async (customerId: string, networkDeviceData: any) => {
  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${networkDeviceBaseUrl}/${customerId}/NetworkDevice`,
    headers: getAuthHeaders(),
    data: networkDeviceData,
  };

  console.log('Request Config:', config); // Log the request configuration

  try {
    const response = await axios.request(config);
    console.log(JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error('Error adding network device data:', error.response); // Log the error response
    throw error;
  }
};

export const updateNetworkDeviceData = async (customerId: string, networkDeviceId: string, networkDeviceData: any) => {
  const config = {
    method: 'put',
    maxBodyLength: Infinity,
    url: `${networkDeviceBaseUrl}/${customerId}/NetworkDevice/${networkDeviceId}`,
    headers: getAuthHeaders(),
    data: networkDeviceData,
  };

  console.log('Request Config:', config); // Log the request configuration

  try {
    const response = await axios.request(config);
    console.log(JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error('Error updating network device data:', error.response); // Log the error response
    throw error;
  }
};

export const deleteNetworkDeviceData = async (customerId: string, networkDeviceId: string) => {
  const config = {
    method: 'delete',
    maxBodyLength: Infinity,
    url: `${networkDeviceBaseUrl}/${customerId}/NetworkDevice/${networkDeviceId}`,
    headers: getAuthHeaders(),
  };

  console.log('Request Config:', config); // Log the request configuration

  try {
    const response = await axios.request(config);
    console.log(JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error('Error deleting network device data:', error.response); // Log the error response
    throw error;
  }
};