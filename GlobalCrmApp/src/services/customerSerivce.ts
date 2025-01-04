import axios, { AxiosRequestConfig } from 'axios';

const BASE_URL = 'https://localhost:7003/api/Customer';

const getAuthHeaders = () => {
  const token = JSON.parse(localStorage.getItem('JwtToken') || '{}').token;
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const getAllCustomers = () => {
  const config: AxiosRequestConfig = {
    method: 'get',
    maxBodyLength: Infinity,
    url: BASE_URL,
    headers: getAuthHeaders(),
  };

  return axios.request(config)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log(error);
      throw error;
    });
};

export const getCustomerById = async (customerId: string) => {
  const config: AxiosRequestConfig = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${BASE_URL}/${customerId}`,
    headers: getAuthHeaders(),
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error('Error fetching customer:', error);
    throw error;
  }
};

export const createCustomer = async (customerData: any) => {
  const config: AxiosRequestConfig = {
    method: 'post',
    maxBodyLength: Infinity,
    url: BASE_URL,
    headers: getAuthHeaders(),
    data: customerData,
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
};

export const updateCustomer = async (customerId: string, customerData: any) => {
  const config: AxiosRequestConfig = {
    method: 'put',
    maxBodyLength: Infinity,
    url: `${BASE_URL}/${customerId}`,
    headers: getAuthHeaders(),
    data: customerData,
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
};

export const deleteCustomer = async (customerId: string) => {
  const config: AxiosRequestConfig = {
    method: 'delete',
    maxBodyLength: Infinity,
    url: `${BASE_URL}/${customerId}`,
    headers: getAuthHeaders(),
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
};

export const patchCustomerStatus = async (customerId: string, isActive: boolean) => {
  const data = JSON.stringify({
    IsActive: isActive,
  });

  const config: AxiosRequestConfig = {
    method: 'patch',
    maxBodyLength: Infinity,
    url: `${BASE_URL}/${customerId}/update-status`,
    headers: getAuthHeaders(),
    data: data,
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error('Error updating customer status:', error);
    throw error;
  }
};

export const updateCustomerPermissions = async (permissionsData: any) => {
  const config: AxiosRequestConfig = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${BASE_URL}/CustomerPermission`,
    headers: getAuthHeaders(),
    data: permissionsData,
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error('Error updating customer permissions:', error);
    throw error;
  }
};

export const getCustomerPermissions = async (customerId: string) => {
  const config: AxiosRequestConfig = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${BASE_URL}/CustomerPermission/${customerId}`,
    headers: getAuthHeaders(),
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error('Error fetching customer permissions:', error);
    throw error;
  }
};

export const getPermissionsByUserId = async (userId: string) => {
  const config: AxiosRequestConfig = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${BASE_URL}/CustomerPermission/user/${userId}`,
    headers: getAuthHeaders(),
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error('Error fetching permissions by user ID:', error);
    throw error;
  }
};

export const customerService = {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  patchCustomerStatus,
  updateCustomerPermissions,
  getCustomerPermissions,
  getPermissionsByUserId,
};