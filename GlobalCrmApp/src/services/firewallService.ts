import axios from 'axios';

const firewallBaseUrl = 'https://localhost:7003/api/CustomerFirewall';

const getAuthHeaders = () => {
  const token = JSON.parse(localStorage.getItem('JwtToken') || '{}').token;
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const getFirewallData = async (customerId: string) => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${firewallBaseUrl}/${customerId}/Firewall`,
    headers: getAuthHeaders(),
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error('Error fetching firewall data:', error.response); // Log the error response
    throw error;
  }
};

export const addFirewallData = async (customerId: string, firewallData: any) => {
  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${firewallBaseUrl}/${customerId}/Firewall`,
    headers: getAuthHeaders(),
    data: firewallData,
  };
  try {
    const response = await axios.request(config);
    console.log(JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error('Error adding firewall data:', error.response); 
    throw error;
  }
};

export const updateFirewallData = async (customerId: string, firewallId: string, firewallData: any) => {
  const config = {
    method: 'put',
    maxBodyLength: Infinity,
    url: `${firewallBaseUrl}/${customerId}/Firewall/${firewallId}`,
    headers: getAuthHeaders(),
    data: firewallData,
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error('Error updating firewall data:', error.response); // Log the error response
    throw error;
  }
};

export const deleteFirewallData = async (customerId: string, firewallId: string) => {
  const config = {
    method: 'delete',
    maxBodyLength: Infinity,
    url: `${firewallBaseUrl}/${customerId}/Firewall/${firewallId}`,
    headers: getAuthHeaders(),
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error('Error deleting firewall data:', error.response); 
    throw error;
  }
};