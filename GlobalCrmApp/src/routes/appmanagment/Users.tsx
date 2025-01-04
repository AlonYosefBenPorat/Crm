import React, { useContext, useEffect, useState } from 'react';
import { usersService } from '../../services/usersService';
import UsersToolbar from '../../components/UsersToolbar';
import { FaCheck, FaTimes } from 'react-icons/fa';
import AddUser from '../AddUser';
import EditUser from './EditUser'; 
import { showErrorDialog, showSuccessDialog } from '../../dialogs/dialogs';
import { DarkModeContext } from '../../contexts/DarkModeContext';
import '../../css/table.scss';

const Users: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState<{ [key: string]: any }>({});
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUserEmail, setSelectedUserEmail] = useState<string | null>(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false); 
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null); 
  const [editingJobTitle, setEditingJobTitle] = useState<{ [key: string]: string }>({}); 
  const { darkMode } = useContext(DarkModeContext);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await usersService.getUsers();
      setUsers(data);
      setFilteredUsers(data);
    };

    fetchUsers();
  }, []);

  const refreshTable = async () => {
    try {
      const response = await usersService.getUsers();
      setUsers(response);
      setFilteredUsers(response); 
    } catch (error) {
      console.error('Error refreshing Users:', error);
    }
  };

  const handleSearch = (query: string) => {
    const lowercasedQuery = query.toLowerCase();
    const filtered = users.filter(user =>
      Object.values(user).some(value =>
        String(value).toLowerCase().includes(lowercasedQuery)
      )
    );
    setFilteredUsers(filtered);
  };

  const handleCheckboxChange = (user: any) => {
    const updatedSelectedUsers = user.id;
    setSelectedUsers(updatedSelectedUsers);
    setSelectedUserEmail(user.email);
    localStorage.setItem('selectedUserId', updatedSelectedUsers);
    localStorage.setItem('selectedUserEmail', user.email);
    setSelectedUserId(user.id);
  };

  const handleAddUserClose = () => {
    setIsAddUserOpen(false);
  };

  const handleEditUserClose = () => {
    setIsEditUserOpen(false);
  };

  const handleEditUserOpen = (userId: string) => {
    setSelectedUserId(userId);
    setIsEditUserOpen(true);
  };

  const handleStatusChange = async (userId: string, newStatus: boolean) => {
    try {
      await usersService.updateUserStatus(userId, newStatus);
      showSuccessDialog('User status updated successfully.');
      await refreshTable();
    } catch (err) {
      showErrorDialog('An error occurred while updating the user status.');
    }
  };

  const handleJobTitleChange = async (userId: string, newJobTitle: string) => {
    try {
      await usersService.updateUserJobTitle(userId, newJobTitle);
      showSuccessDialog('Job title updated successfully.');
      await refreshTable();
    } catch (err) {
      showErrorDialog('An error occurred while updating the job title.');
    }
  };

  const handleJobTitleDoubleClick = (userId: string, currentJobTitle: string) => {
    setEditingJobTitle({ ...editingJobTitle, [userId]: currentJobTitle });
  };

  const handleJobTitleBlur = async (userId: string) => {
    const newJobTitle = editingJobTitle[userId];
    if (newJobTitle !== undefined) {
      await handleJobTitleChange(userId, newJobTitle);
      setEditingJobTitle({ ...editingJobTitle, [userId]: undefined });
    }
  };

  const handleJobTitleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>, userId: string) => {
    if (event.key === 'Enter') {
      await handleJobTitleBlur(userId);
    }
  };

  const handleJobTitleChangeInput = (userId: string, value: string) => {
    setEditingJobTitle({ ...editingJobTitle, [userId]: value });
  };

  return (
    <div className="users-directory mt-8 p-4">
      <h2 className="text-2xl font-semibold mb-4 text-center">Users Directory</h2>
      <UsersToolbar refreshTable={refreshTable} selectedUserId={selectedUserId} onSearch={handleSearch} />

      <table className="users-table min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="checkbox"><input type="checkbox" /></th>
            <th>Display Full Name</th>
            <th>Username</th>
            <th>Phone Number</th>
            <th>Job Title</th>
            <th className="status-icon">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id}>
              <td className="checkbox">
                <input
                  type="checkbox"
                  checked={selectedUsers === user.id}
                  onChange={() => handleCheckboxChange(user)}
                />
              </td>
              <td
                className="clickable"
                onClick={() => handleEditUserOpen(user.id)}
              >
                {user.firstName + " " + user.lastName}
              </td>
              <td className="clickable"
                onClick={() => handleEditUserOpen(user.id)}>{user.email}</td>
              <td>{user.phoneNumber}</td>
              <td
                className="clickable"
                onDoubleClick={() => handleJobTitleDoubleClick(user.id, user.jobTitle)}
              >
                {editingJobTitle[user.id] !== undefined ? (
                  <input
                    type="text"
                    value={editingJobTitle[user.id]}
                    onChange={(e) => handleJobTitleChangeInput(user.id, e.target.value)}
                    onBlur={() => handleJobTitleBlur(user.id)}
                    onKeyDown={(e) => handleJobTitleKeyDown(e, user.id)}
                    autoFocus
                  />
                ) : (
                  user.jobTitle
                )}
              </td>
              <td className="status-icon" onClick={() => handleStatusChange(user.id, !user.isEnabled)}>
                {user.isEnabled ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isAddUserOpen && (
        <AddUser onClose={handleAddUserClose} refreshTable={refreshTable} />
      )}
      {isEditUserOpen && selectedUserId !== null && (
        <EditUser userId={selectedUserId} onClose={handleEditUserClose} refreshTable={refreshTable} />
      )}
    </div>
  );
};

export default Users;