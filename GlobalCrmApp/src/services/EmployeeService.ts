import axios from 'axios';

const EmployeeBaseUrl = 'https://localhost:7003/api/Employee';

const getAuthHeaders = () => {
  const token = JSON.parse(localStorage.getItem('JwtToken') || '{}').token;
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const getAllEmployees = async (customerId: string) => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${EmployeeBaseUrl}/${customerId}/employees`,
    headers: getAuthHeaders(),
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error('Error fetching employees:', error.response || error.message);
    throw error;
  }
};

export const addEmployee = async (customerId: string, employee: any) => {
  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${EmployeeBaseUrl}/${customerId}/employee`,
    headers: getAuthHeaders(),
    data: JSON.stringify(employee),
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error('Error adding employee:', error.response || error.message);
    throw error;
  }
};

export const deleteEmployee = async (customerId: string, employeeId: string) => {
  const config = {
    method: 'delete',
    url: `${EmployeeBaseUrl}/${customerId}/employee/${employeeId}`,
    headers: getAuthHeaders(),
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error('Error deleting employee:', error.response || error.message);
    throw error;
  }
};

export const updateEmployeeStatus = async (customerId: string, employeeId: string, isActive: boolean) => {
  const data = JSON.stringify({ isActive });

  const config = {
    method: 'patch',
    maxBodyLength: Infinity,
    url: `${EmployeeBaseUrl}/${customerId}/employee/${employeeId}/update-status`,
    headers: getAuthHeaders(),
    data: data,
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error('Error updating employee status:', error.response || error.message);
    throw error;
  }
};

export const updateEmployee = async (customerId: string, employeeId: string, employeeData: any) => {
  const data = JSON.stringify(employeeData);

  const config = {
    method: 'put',
    maxBodyLength: Infinity,
    url: `${EmployeeBaseUrl}/${customerId}/employee/${employeeId}`,
    headers: getAuthHeaders(),
    data: data,
  };

  console.log('Request Config:', config);

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error('Error updating employee:', error.response || error.message);
    throw error;
  }
};

export default { getAllEmployees, addEmployee, deleteEmployee, updateEmployeeStatus, updateEmployee };