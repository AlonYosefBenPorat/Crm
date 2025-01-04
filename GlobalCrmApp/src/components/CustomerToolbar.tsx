import React, { useState } from 'react';
import { FiEdit, FiKey, FiSearch, FiTrash2 } from 'react-icons/fi';
import { MdAddBusiness } from 'react-icons/md';
import '../css/Toolbar.scss'; 
import '../css/sidewindow.scss';
import { customerService } from '../services/customerSerivce';
import { showErrorDialog, showSuccessDialog, showDeleteConfirmation } from '../dialogs/dialogs';
import AddCustomer from '../routes/appmanagment/AddCustomer';
import EditCustomer from '../routes/appmanagment/EditCustomer';


interface CustomerToolbarProps {
  refreshTable: () => Promise<void>;
  selectedCustomerId: string | null;
  onSearch: (query: string) => void;
}

const CustomerToolbar: React.FC<CustomerToolbarProps> = ({ refreshTable, selectedCustomerId, onSearch }) => {
  const [isCustomerPermissionOpen, setIsCustomerPermissionOpen] = useState(false);
  const [isCustomerAddOpen, setIsCustomerAddOpen] = useState(false);
  const [isCustomerEditOpen, setIsCustomerEditOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleCustomerAdd = () => {
    setIsCustomerAddOpen(!isCustomerAddOpen);
    setIsCustomerEditOpen(false);
    setIsCustomerPermissionOpen(false);
  };

  const toggleCustomerEdit = () => {
    if (!selectedCustomerId) {
      showErrorDialog('No customer selected');
      return;
    }
    setIsCustomerEditOpen(!isCustomerEditOpen);
    setIsCustomerAddOpen(false);
    setIsCustomerPermissionOpen(false);
    console.log('Edit customer with id:', selectedCustomerId);
  };

  const handleDeleteCustomer = async () => {
    if (!selectedCustomerId) {
      showErrorDialog('No customer selected');
      return;
    }
    console.log('Delete customer with id:', selectedCustomerId);
    try {
      const isConfirmed = await showDeleteConfirmation();
      if (!isConfirmed) {
        return;
      }
      await customerService.deleteCustomer(selectedCustomerId);
      const customerName = localStorage.getItem('selectedCustomerName');
      await refreshTable();
      showSuccessDialog(`Customer deleted successfully. Name: ${customerName}`);
      localStorage.removeItem('selectedCustomerId');
      localStorage.removeItem('selectedCustomerName');
    } catch (error) {
      const customerName = localStorage.getItem('selectedCustomerName');
      showErrorDialog(`An error occurred while deleting the customer: ${customerName}.`);
      await refreshTable();
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    onSearch(query); 
  };

  return (
    <div className="toolbar">
      <div className="toolbar-container">
        <ul className="toolbar-list">
          <li><MdAddBusiness className="icon-button" title="Add Customer" aria-label="Add Customer" onClick={toggleCustomerAdd} /></li>
          <li><FiTrash2 className="icon-button" title="Delete Customer" aria-label="Delete Customer" onClick={handleDeleteCustomer} /></li>
          <li><FiEdit className="icon-button" title="Edit" aria-label="Edit" onClick={toggleCustomerEdit} /></li>
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

        {isCustomerAddOpen && <AddCustomer onClose={toggleCustomerAdd} refreshTable={refreshTable} />}
        {isCustomerEditOpen && selectedCustomerId && (
          <EditCustomer onClose={() => setIsCustomerEditOpen(false)} customerId={selectedCustomerId} refreshTable={refreshTable} />
        )}
      </div>
    </div>
  );
};

export default CustomerToolbar;