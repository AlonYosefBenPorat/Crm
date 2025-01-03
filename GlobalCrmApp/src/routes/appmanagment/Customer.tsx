import React, { useEffect, useState } from 'react';
import { customerService, getAllCustomers } from '../../services/customerSerivce'; 
import { FaCheck, FaTimes } from 'react-icons/fa';
import '../../css/table.scss';
import CustomerToolbar from '../../components/CustomerToolbar';
import AddCustomer from './AddCustomer'; 
import { showErrorDialog, showSuccessDialog } from '../../dialogs/dialogs';

const Customer: React.FC = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false); 

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await getAllCustomers();
        setCustomers(response);
        setFilteredCustomers(response);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, []);

  const refreshTable = async () => {
    try {
      const response = await getAllCustomers();
      setCustomers(response);
      setFilteredCustomers(response);
      setSelectedCustomerId(null);
      localStorage.removeItem('selectedCustomerId');
      localStorage.removeItem('selectedCustomerName');
    } catch (error) {
      console.error('Error refreshing customers:', error);
    }
  };

  const handleSearch = (query: string) => {
    const lowercasedQuery = query.toLowerCase();
    const filtered = customers.filter(customer =>
      Object.values(customer).some(value =>
        String(value).toLowerCase().includes(lowercasedQuery)
      )
    );
    setFilteredCustomers(filtered);
  };

  const handleCheckboxChange = (customer: any) => {
    const updatedSelectedCustomers = customer.id;
    setSelectedCustomerId(updatedSelectedCustomers);
    localStorage.setItem('selectedCustomerId', updatedSelectedCustomers);
    localStorage.setItem('selectedCustomerName', customer.name);
  };

  const handleAddCustomerClose = () => {
    setIsAddCustomerOpen(false);
  };

  const handleStatusChange = async (customerId: string, newStatus: boolean) => {
    try {
      await customerService.patchCustomerStatus(customerId, newStatus);
      showSuccessDialog('Customer status updated successfully.');
      await refreshTable();
    } catch (err) {
      showErrorDialog('An error occurred while updating the Customer status.');
    }
  };

  return (
    <div className="users-directory mt-8 p-4">
      <h2 className="text-2xl font-semibold mb-4 text-center">Customer Management Directory</h2>
      <CustomerToolbar refreshTable={refreshTable} selectedCustomerId={selectedCustomerId} onSearch={handleSearch} />
      <button onClick={() => setIsAddCustomerOpen(true)}>Add Customer</button> 

      <div className="overflow-auto">
        <table className="users-table min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-2">
                <input type="checkbox" />
              </th>
              {["Logo", "Customer", "Country", "City", "Address", "Phone", "Contact Person", "Domain", "BN Number", "Status"].map((header) => (
                <th key={header} className="px-4 py-2 text-left text-gray-600 font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedCustomerId === customer.id}
                    onChange={() => handleCheckboxChange(customer)}
                  />
                </td>
                <td className="p-4">
                  {customer.logoSrc ? (
                    <img src={customer.logoSrc} alt={customer.logoAlt} className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">N/A</div>
                  )}
                </td>
                <td className="p-4">{customer.name}</td>
                <td className="p-4">{customer.country}</td>
                <td className="p-4">{customer.city}</td>
                <td className="p-4">{customer.address}</td>
                <td className="p-4">{customer.phone}</td>
                <td className="p-4">{customer.contactPerson}</td>
                <td className="p-4">{customer.domain}</td>
                <td className="p-4">{customer.bnNumber}</td>
                <td className="p-4 status-icon" onClick={() => handleStatusChange(customer.id, !customer.isActive)}>
                  {customer.isActive ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAddCustomerOpen && (
        <AddCustomer onClose={handleAddCustomerClose} refreshTable={refreshTable} />
      )}
    </div>
  );
};

export default Customer;