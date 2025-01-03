import axios from 'axios';

const serverbaseurl = 'https://localhost:7003/api/CustomerServer';

const getAuthHeaders = () => {
  const token = JSON.parse(localStorage.getItem('JwtToken') || '{}').token;
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const getServerData = async (customerId: string) => {
  console.log('Customer ID:', customerId); // Log the customer ID

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${serverbaseurl}/${customerId}/server`,
    headers: getAuthHeaders(),
  };

  console.log('Request Config:', config); 

  try {
    const response = await axios.request(config);
    console.log(JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error('Error Response:', error.response); 
    throw error;
  }
};

export const addServerData = async (customerId: string, serverData: any) => {
  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${serverbaseurl}/${customerId}/server`,
    headers: getAuthHeaders(),
    data: serverData, };

  console.log('Request Config:', config); // Log the request configuration

  try {
    const response = await axios.request(config);
    console.log(JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error('Error Response:', error.response); // Log the error response
    throw error;
  }
};

export const deleteServerData = async (customerId: string, serverId: string) => {
  const config = {
    method: 'delete',
    maxBodyLength: Infinity,
    url: `${serverbaseurl}/${customerId}/server/${serverId}`,
    headers: getAuthHeaders(),
  };

  console.log('Request Config:', config); // Log the request configuration

  try {
    const response = await axios.request(config);
    console.log(JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error('Error Response:', error.response); // Log the error response
    throw error;
  }
};

export const updateServerData = async (customerId: string, serverId: string, serverData: any) => {
  const config = {
    method: 'put',
    maxBodyLength: Infinity,
    url: `${serverbaseurl}/${customerId}/server/${serverId}`,
    headers: getAuthHeaders(),
    data: serverData,
  };

  console.log('Request Config:', config); // Log the request configuration

  try {
    const response = await axios.request(config);
    console.log(JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error('Error Response:', error.response); // Log the error response
    throw error;
  }
};



