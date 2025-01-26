import React, { useEffect, useState } from 'react';
import { getAllCustomers } from '../../services/customerSerivce';
import { usersService } from '../../services/usersService';
import { deleteUsersPermissionsOneClick, getUserPermissions, updateUserPermissions } from '../../services/userPermissionService';
import { AiOutlineUserDelete, AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { MdOutlineMailOutline } from 'react-icons/md';
import { showDeleteConfirmation, showErrorDialog, showSuccessDialog, showAutoCloseAlert } from '../../dialogs/dialogs';
import { sendEmail } from '../../services/smtp-Service'; // Import your SMTP service
import '../../css/CustomerPermissionUser.scss';

const CustomerPermissionUser = ({ onClose }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [customers, setCustomers] = useState([]);
  const [permissions, setPermissions] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await usersService.getUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await getAllCustomers();
        setCustomers(response);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, []);

  const refreshTable = (userId: string) => {
    return getUserPermissions(userId).then((data) => {
      if (Array.isArray(data)) {
        const permissionsMap = data.reduce((acc, permission) => {
          acc[permission.customerId] = {
            write: permission.canWrite,
            read: permission.canRead,
            delete: permission.canDelete,
          };
          return acc;
        }, {});
        setPermissions(permissionsMap);
      }
    }).catch((error) => {
      console.error('Error fetching permissions:', error);
    });
  };

  useEffect(() => {
    if (selectedUser) {
      refreshTable(selectedUser);
    }
  }, [selectedUser]);

  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = event.target.value;
    setSelectedUser(userId);
    localStorage.setItem('selectedUser', userId);
    refreshTable(userId);
  };

  const handlePermissionChange = (customerId: string, permissionType: string) => async (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedPermissions = {
      ...permissions,
      [customerId]: {
        ...permissions[customerId],
        [permissionType]: event.target.checked,
      },
    };
    setPermissions(updatedPermissions);

    const userPermission = {
      userId: selectedUser,
      customerId: customerId,
      canRead: updatedPermissions[customerId].read,
      canWrite: updatedPermissions[customerId].write,
      canDelete: updatedPermissions[customerId].delete,
    };

    try {
      await updateUserPermissions(userPermission);
      await refreshTable(selectedUser);
      showAutoCloseAlert("Permissions updated successfully");
    } catch (error) {
      console.error('Error updating permissions:', error);
      showErrorDialog('An error occurred while updating permissions Try again later.');
    }
  };

  const handleDeletePermissionForAllCustomerOneClick = async () => {
    try {
      const confirmed = await showDeleteConfirmation();
      if (confirmed) {
        await deleteUsersPermissionsOneClick(selectedUser);
        await refreshTable(selectedUser);
        showAutoCloseAlert("Permissions deleted successfully");
      }
    } catch (error) {
      console.error('Error deleting permissions:', error);
      showErrorDialog('An error occurred while deleting permissions.');
    }
  };

  const notifyUserPermission = async () => {
    try {
      const permissions = await getUserPermissions(selectedUser);
      if (permissions) {
        const user = users.find(user => user.id === selectedUser);
        if (user) {
          const customerMap = customers.reduce((acc, customer) => {
            acc[customer.id] = customer.name;
            return acc;
          }, {});

          const formattedPermissions = permissions.map(permission => ({
            customerName: customerMap[permission.customerId],
            canRead: permission.canRead ? "Permission Updated" : null,
            canWrite: permission.canWrite ? "Permission Updated" : null,
            canDelete: permission.canDelete ? "Permission Updated" : null
          }));

          const emailMessage = formattedPermissions.map(permission => {
            const permissionLines = [];
            if (permission.canRead) permissionLines.push(`Read: ${permission.canRead}`);
            if (permission.canWrite) permissionLines.push(`Write: ${permission.canWrite}`);
            if (permission.canDelete) permissionLines.push(`Delete: ${permission.canDelete}`);
            return `Customer: ${permission.customerName}\n${permissionLines.join('\n')}`;
          }).join('\n\n');

          await sendEmail({
            toEmail: user.email,
            subject: 'Your Permissions to Crm Updated',
            message: emailMessage
          });
          showSuccessDialog(`User notified successfully: ${user.email}`);
        }
      }
    } catch (error) {
      console.error('Error notifying user:', error);
      showErrorDialog('An error occurred while notifying the user.');
    }
  };

  const notifyUserPermissionForCustomer = async (customerId: string) => {
    try {
      const permissions = await getUserPermissions(selectedUser);
      if (permissions) {
        const user = users.find(user => user.id === selectedUser);
        if (user) {
          const customerMap = customers.reduce((acc, customer) => {
            acc[customer.id] = customer.name;
            return acc;
          }, {});

          const permission = permissions.find(p => p.customerId === customerId);
          if (permission) {
            const formattedPermission = {
              customerName: customerMap[permission.customerId],
              canRead: permission.canRead ? "Permission Updated" : null,
              canWrite: permission.canWrite ? "Permission Updated" : null,
              canDelete: permission.canDelete ? "Permission Updated" : null
            };

            const emailMessage = `Customer: ${formattedPermission.customerName}\n` +
              `${formattedPermission.canRead ? `Read: ${formattedPermission.canRead}\n` : ''}` +
              `${formattedPermission.canWrite ? `Write: ${formattedPermission.canWrite}\n` : ''}` +
              `${formattedPermission.canDelete ? `Delete: ${formattedPermission.canDelete}\n` : ''}`;

            await sendEmail({
              toEmail: user.email,
              subject: 'Your Permissions to Crm Updated',
              message: emailMessage
            });
            showSuccessDialog(`User notified successfully: ${user.email}`);
          }
        }
      }
    } catch (error) {
      console.error('Error notifying user:', error);
      showErrorDialog('An error occurred while notifying the user.');
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredCustomers.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleShowAll = () => {
    setItemsPerPage(filteredCustomers.length);
  };

  return (
    <div className='mt-10'>
      <div>
        <div>
          <h2 className='h2'>Customer Permissions</h2>
        </div>
        <div className="search-container">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
        <div className="content">
          <form className='border-bottom-gray-bold'>
            
            <select id="User" name="User" value={selectedUser} onChange={handleUserChange} className="modern-select">
              <option value="">Select a User to Edit Permission</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.email}
                </option>
              ))}
            </select>
            <div className="flex justify-end">
              <button  title= 'Remove All Permissions' type="button" onClick={handleDeletePermissionForAllCustomerOneClick} className="icon-button">
                <AiOutlineUserDelete aria-label='Remove All Permissions'  />
              </button>
              <button title='Send user Permissions' type="button" onClick={notifyUserPermission} className="icon-button">
                <MdOutlineMailOutline aria-label='Send user Permissions' />
              </button>
            </div>
          </form>
          
        </div>
        <table className="users-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Write</th>
              <th>Read</th>
              <th>Delete</th>
              <th>Notify User</th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.name}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={permissions[customer.id]?.write || false}
                    onChange={handlePermissionChange(customer.id, 'write')}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={permissions[customer.id]?.read || false}
                    onChange={handlePermissionChange(customer.id, 'read')}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={permissions[customer.id]?.delete || false}
                    onChange={handlePermissionChange(customer.id, 'delete')}
                  />
                </td>
                <td className="notify-user-cell">
                  <button type="button" onClick={() => notifyUserPermissionForCustomer(customer.id)} className="icon-button">
                    <MdOutlineMailOutline aria-label='send user permissions by Email' title='send user permissions by Email' />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button title='previous' type="button" onClick={handlePreviousPage} className="icon-button">
            <AiOutlineLeft aria-label='previous' />
          </button>
          <button title='Next' type="button" onClick={handleNextPage} className="icon-button">
            <AiOutlineRight aria-label='next'/>
          </button>
          <button title='Show All' aria-label='Show All' type="button" onClick={handleShowAll} className="btn">
            Show All
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerPermissionUser;