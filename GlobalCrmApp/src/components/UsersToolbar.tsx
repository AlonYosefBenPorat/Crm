import React, { useEffect, useState } from 'react';
import { FiUserPlus, FiKey, FiTrash2, FiEdit, FiSearch } from 'react-icons/fi';
import '../css/Toolbar.scss';
import AddUser from '../routes/AddUser';
import ResetUserPassword from '../routes/appmanagment/ResetUserPassword';
import { usersService } from '../services/usersService';
import { showDeleteConfirmation, showErrorDialog, showSuccessDialog } from '../dialogs/dialogs';
import EditUser from '../routes/appmanagment/EditUser';

interface UsersToolbarProps {
  refreshTable: () => Promise<void>;
  selectedUserId: string | null;
  onSearch: (query: string) => void;
}

const UsersToolbar: React.FC<UsersToolbarProps> = ({ refreshTable, selectedUserId,onSearch }) => {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleAddUser = () => {
    setIsAddUserOpen(!isAddUserOpen);
    setIsResetPasswordOpen(false);
    setIsEditUserOpen(false);
  };

  const handleEdit = () => {
    if (!selectedUserId) {
      showErrorDialog('No user selected');
      return;
    }
    setIsEditUserOpen(!isEditUserOpen);
    setIsResetPasswordOpen(false);
    setIsAddUserOpen(false);
    console.log('Edit user with id:', selectedUserId);
  };

  const toggleResetPassword = () => {
    if (!selectedUserId) {
      showErrorDialog('No user selected');
      return;
    }
    setIsResetPasswordOpen(!isResetPasswordOpen);
    setIsAddUserOpen(false);
    setIsEditUserOpen(false);
  };

  const handleDeleteUser = async () => {
    if (!selectedUserId) {
      showErrorDialog('No user selected');
      return;
    }
    console.log('Delete user with id:', selectedUserId);
    try {
      const isConfirmed = await showDeleteConfirmation();
      if (!isConfirmed) {
        return;
      }
      await usersService.deleteUser(selectedUserId);
      const userEmail = localStorage.getItem('selectedUserEmail');
      refreshTable();
      showSuccessDialog(`User deleted successfully. Email: ${userEmail}`);
      localStorage.removeItem('selectedUserId');
      localStorage.removeItem('selectedUserEmail');
    } catch (error) {
      const userEmail = localStorage.getItem('selectedUserEmail');
      showErrorDialog(`An error occurred while deleting the user: ${userEmail}.`);
      refreshTable();
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    onSearch(query); // Call the onSearch prop with the query
  };

  return (
    <div className="toolbar">
      <div className="toolbar-container">
        <ul className="toolbar-list">
          <li>
            <button className="icon-button" title="Add User" onClick={toggleAddUser}>
              <FiUserPlus />
            </button>
          </li>
          <li>
            <button className="icon-button" title="Reset Password" onClick={toggleResetPassword}>
              <FiKey />
            </button>
          </li>
          <li>
            <button className="icon-button" title="Delete User" onClick={handleDeleteUser}>
              <FiTrash2 />
            </button>
          </li>
          <li>
            <button className="icon-button" title="Edit" onClick={handleEdit}>
              <FiEdit />
            </button>
          </li>
        </ul>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <FiSearch className="search-icon" />
        </div>
        {isAddUserOpen && <AddUser onClose={toggleAddUser} refreshTable={refreshTable} />}
        {isResetPasswordOpen && selectedUserId && (
          <ResetUserPassword onClose={toggleResetPassword} userId={selectedUserId} refreshTable={refreshTable} />
        )}
        {isEditUserOpen && selectedUserId && (
          <EditUser onClose={() => setIsEditUserOpen(false)} userId={selectedUserId} refreshTable={refreshTable} />
        )}
      </div>
    </div>
  );
};

export default UsersToolbar;