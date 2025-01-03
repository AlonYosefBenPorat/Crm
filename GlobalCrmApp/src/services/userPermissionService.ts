import axios from 'axios';

const basePermissionUrl = 'https://localhost:7003/api/CustomerPermission';

interface UserPermission {
  userId: string;
  customerId: string;
  canRead: boolean;
  canWrite: boolean;
  canDelete: boolean;
}

const getAuthHeaders = () => {
  const token = JSON.parse(localStorage.getItem('JwtToken') || '{}').token;
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const getUserPermissions = async (userId: string): Promise<UserPermission[] | null> => {
  try {
    const response = await axios.get<UserPermission[]>(`${basePermissionUrl}/user/${userId}/all`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    return null;
  }
};

export const updateUserPermissions = async (userPermission: UserPermission): Promise<UserPermission | null> => {
  try {
    const response = await axios.post<UserPermission>(basePermissionUrl, userPermission, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user permissions:', error);
    return null;
  }
};

export const deleteUsersPermissionsOneClick = async (userId: string): Promise<void> => {
    try {
        await axios.delete(`${basePermissionUrl}/user/${userId}`, {
        headers: getAuthHeaders(),
        });
    } catch (error) {
        console.error('Error deleting user permissions:', error);
    }
    }