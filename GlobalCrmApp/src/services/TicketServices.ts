import axios from 'axios';

const baseticketUrl = 'https://localhost:7003/api/Ticket';

const getAuthHeaders = () => {
  const token = JSON.parse(localStorage.getItem('JwtToken') || '{}').token;
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};


// Get all tickets
export const getAllTickets = async () => {
  const config = {
    method: 'get',
    url: `${baseticketUrl}`,
    headers: getAuthHeaders(),
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error('Error fetching all tickets:', error.response || error.message);
    throw error;
  }
};

//Get Ticket By Customer Id

export const getTicketByCustomerId = async (customerId: string) => { 
  const config = {
    method: 'get',
    url: `${baseticketUrl}/${customerId}`,
    headers: getAuthHeaders(),
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ticket with ID ${customerId}:`, error.response || error.message);
    throw error;
  }
}

// Get ticket by ID
export const getTicketById = async (ticketId: string) => {
  const config = {
    method: 'get',
    url: `${baseticketUrl}/${ticketId}`,
    headers: getAuthHeaders(),
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ticket with ID ${ticketId}:`, error.response || error.message);
    throw error;
  }
};

// Add a new ticket

export const addTicket = async (ticketData: any) => {
  const config = {
    method: 'post',
    url: `${baseticketUrl}`,
    headers: getAuthHeaders(),
    data: JSON.stringify(ticketData),
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error('Error adding ticket:', error.response || error.message);
    throw error;
  }
};

// Update a ticket
export const updateTicket = async (ticketId: string, ticketData: any) => {
  const config = {
    method: 'put',
    url: `${baseticketUrl}/${ticketId}`,
    headers: getAuthHeaders(),
    data: JSON.stringify(ticketData),
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error(`Error updating ticket with ID ${ticketId}:`, error.response || error.message);
    throw error;
  }
};

// Add a new activity to a ticket
export const addActivityToTicket = async (ticketId: string, activityData: any) => {
  const config = {
    method: 'post',
    url: `${baseticketUrl}/${ticketId}/addUserActivity`,
    headers: getAuthHeaders(),
    data: JSON.stringify(activityData),
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error(`Error adding activity to ticket with ID ${ticketId}:`, error.response || error.message);
    throw error;
  }
};

// Update a user activity
export const updateUserActivity = async (ticketId: number, activityId: number, activityData: any) => {
  const config = {
    method: 'put',
    url: `${baseticketUrl}/${ticketId}/updateUserActivity`,
    headers: getAuthHeaders(),
    data: JSON.stringify(activityData),
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error(`Error updating user activity with ID ${activityId} for ticket with ID ${ticketId}:`, error.response || error.message);
    throw error;
  }
};

// Close a ticket
export const closeTicket = async (ticketId: string) => {
  const config = {
    method: 'put',
    url: `${baseticketUrl}/${ticketId}/close`,
    headers: getAuthHeaders(),
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error(`Error closing ticket with ID ${ticketId}:`, error.response || error.message);
    throw error;
  }
};

// Delete a ticket
export const deleteTicket = async (ticketId: string) => {
  const config = {
    method: 'delete',
    url: `${baseticketUrl}/${ticketId}`,
    headers: getAuthHeaders(),
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error(`Error deleting ticket with ID ${ticketId}:`, error.response || error.message);
    throw error;
  }
};

// Delete a user activity
export const deleteUserActivity = async (ticketId: string, activityId: string) => {
  const config = {
    method: 'delete',
    url: `${baseticketUrl}/${ticketId}/deleteUserActivity/${activityId}`,
    headers: getAuthHeaders(),
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user activity with ID ${activityId} for ticket with ID ${ticketId}:`, error.response || error.message);
    throw error;
  }
};

// Get active tickets
export const getActiveTickets = async () => {
  const config = {
    method: 'get',
    url: `${baseticketUrl}/active`,
    headers: getAuthHeaders(),
  };

  try {
    const response = await axios.request(config);
    console.log(JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error('Error fetching active tickets:', error.response || error.message);
    throw error;
  }
};

export default { getAllTickets, getTicketById, addTicket, updateTicket, addActivityToTicket, updateUserActivity, closeTicket, deleteTicket, deleteUserActivity, getActiveTickets };