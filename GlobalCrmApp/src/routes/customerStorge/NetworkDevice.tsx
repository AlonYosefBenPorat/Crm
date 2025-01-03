import React, { useEffect, useState } from "react";
import { getNetworkDeviceData, addNetworkDeviceData, deleteNetworkDeviceData, updateNetworkDeviceData } from "../../services/networkDeviceService";
import { LoadingSpinner } from "../../components/Spinner";
import { CgMinimizeAlt } from "react-icons/cg";
import { RiMenuAddLine } from "react-icons/ri";
import { GiReturnArrow } from "react-icons/gi";
import { MdOutlineCloudUpload, MdOutlineDeleteSweep } from "react-icons/md";
import { FaCheck, FaTimes } from "react-icons/fa";
import { showErrorDialog, showSuccessDialog } from "../../dialogs/dialogs";
import '../../css/table.scss';
import { TbUserEdit } from "react-icons/tb";
import { FcNext, FcPrevious } from "react-icons/fc";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface NetworkDeviceProps {
  onMinimize: () => void;
  customerId: string;
}

const NetworkDevice: React.FC<NetworkDeviceProps> = ({ onMinimize, customerId }) => {
  const [isAddingNetworkDevice, setIsAddingNetworkDevice] = useState(false);
  const [networkDevices, setNetworkDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newNetworkDevice, setNewNetworkDevice] = useState({
    model: '',
    brand: '',
    type: '',
    vendor: '',
    ipAddress: '',
    serialNumber: '',
    description: '',
    warrantyExpiration: new Date(),
    customerId: customerId
  });
  const [selectedNetworkDeviceId, setSelectedNetworkDeviceId] = useState<string | null>(null);
  const [editableNetworkDeviceId, setEditableNetworkDeviceId] = useState<string | null>(null);
  const [updatedNetworkDeviceData, setUpdatedNetworkDeviceData] = useState<any>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    refreshTable();
  }, [customerId]);

  useEffect(() => {
    const savedNetworkDeviceId = localStorage.getItem('selectedNetworkDeviceId');
    if (savedNetworkDeviceId) {
      setSelectedNetworkDeviceId(savedNetworkDeviceId);
    }
  }, []);

  useEffect(() => {
    if (selectedNetworkDeviceId) {
      localStorage.setItem('selectedNetworkDeviceId', selectedNetworkDeviceId);
    } else {
      localStorage.removeItem('selectedNetworkDeviceId');
    }
  }, [selectedNetworkDeviceId]);

  const refreshTable = async () => {
    setLoading(true);
    try {
      const networkDeviceData = await getNetworkDeviceData(customerId);
      setNetworkDevices(networkDeviceData);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch network device data');
      setLoading(false);
    }
  };

  if (loading) {
    return <div><LoadingSpinner/></div>;
  }

  const handleAddItem = () => {
    setIsAddingNetworkDevice(!isAddingNetworkDevice);
    setNewNetworkDevice({
      model: '',
      brand: '',
      type: '',
      vendor: '',
      ipAddress: '',
      serialNumber: '',
      description: '',
      warrantyExpiration: new Date(),
      customerId: customerId
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewNetworkDevice({ ...newNetworkDevice, [name]: value });
  };

  const handleDateChange = (date: Date) => {
    setNewNetworkDevice({ ...newNetworkDevice, warrantyExpiration: date });
  };

  const handleSaveNetworkDevice = async () => {
    try {
      console.log('Adding network device data:', newNetworkDevice); // Log the data being sent
      if (editableNetworkDeviceId) {
        await updateNetworkDeviceData(customerId, editableNetworkDeviceId, updatedNetworkDeviceData);
        showSuccessDialog('Network device updated successfully');
      } else {
        await addNetworkDeviceData(customerId, newNetworkDevice);
        showSuccessDialog('Network device added successfully');
      }
      setIsAddingNetworkDevice(false);
      setEditableNetworkDeviceId(null);
      setNewNetworkDevice({
        model: '',
        brand: '',
        type: '',
        vendor: '',
        ipAddress: '',
        serialNumber: '',
        description: '',
        warrantyExpiration: new Date(),
        customerId: customerId
      });
      refreshTable();
    } catch (error) {
      console.error('Error adding network device data:', error.response); // Log the error response
      setError('Failed to save network device');
      showErrorDialog('Failed to save network device');
    }
  };

  const handleRowClick = (networkDeviceId: string) => {
    if (selectedNetworkDeviceId === networkDeviceId) {
      setSelectedNetworkDeviceId(null);
    } else {
      setSelectedNetworkDeviceId(networkDeviceId);
    }
  };

  const handleDeleteNetworkDevice = async () => {
    if (selectedNetworkDeviceId) {
      try {
        await deleteNetworkDeviceData(customerId, selectedNetworkDeviceId);
        setSelectedNetworkDeviceId(null);
        showSuccessDialog('Network device deleted successfully');
        refreshTable();
      } catch (error) {
        setError('Failed to delete network device');
        showErrorDialog('Failed to delete network device');
      }
    }
  };

  const handleEditClick = (networkDeviceId: string | null) => {
    if (editableNetworkDeviceId === networkDeviceId) {
      setEditableNetworkDeviceId(null);
      setUpdatedNetworkDeviceData({});
    } else {
      setEditableNetworkDeviceId(networkDeviceId);
      const networkDevice = networkDevices.find(nd => nd.id === networkDeviceId);
      setUpdatedNetworkDeviceData({
        ...networkDevice,
        warrantyExpiration: new Date(networkDevice.warrantyExpiration)
      });
    }
  };

  const handleUpdateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedNetworkDeviceData({
      ...updatedNetworkDeviceData,
      [name]: value
    });
  };

  const handleUpdateDateChange = (date: Date) => {
    setUpdatedNetworkDeviceData({
      ...updatedNetworkDeviceData,
      warrantyExpiration: date
    });
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = networkDevices.slice(indexOfFirstRow, indexOfLastRow);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className='mt-15'>
      <div className="table-actions-container">
        <ul className="table-actions">
          <li>
            <CgMinimizeAlt 
              onClick={onMinimize} 
              title="Minimize" 
              className="icon-button" 
              aria-label="Minimize"
            />
          </li>
          <li>
            <RiMenuAddLine 
              onClick={handleAddItem} 
              className="icon-button" 
              title="Add Network Device" 
              aria-label="Add Network Device"
            />
          </li>
          <li>
            <TbUserEdit 
              onClick={() => handleEditClick(selectedNetworkDeviceId)} 
              className="icon-button" 
              title="Edit Network Device" 
              aria-label="Edit Network Device"
            />
          </li>
          <li>
            <MdOutlineDeleteSweep 
              onClick={handleDeleteNetworkDevice} 
              className="icon-button" 
              title="Delete Network Device" 
              aria-label="Delete Network Device"
            />
          </li>
          <li>
            <GiReturnArrow 
              title="Refresh" 
              className="icon-button" 
              onClick={refreshTable} 
              aria-label="Refresh"
            />
          </li>
          {(isAddingNetworkDevice || editableNetworkDeviceId) && (
            <li>
              <MdOutlineCloudUpload 
                className="icon-button" 
                onClick={handleSaveNetworkDevice} 
                title="Save Network Device" 
                aria-label="Save Network Device"
              />
            </li>
          )}
        </ul>
      </div>
      <div className="pagination-controls flex justify-between items-center my-4">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Rows per page:
          <select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </label>
        <div>
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="bg-blue-300 text-gray-700 font-semibold py-2 px-4 rounded-l hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous Page"
            title="Previous Page"
          >
            <FcPrevious />
          </button>
          <button
            onClick={handleNextPage}
            disabled={indexOfLastRow >= networkDevices.length}
            className="bg-blue-300 text-gray-700 font-semibold py-2 px-4 rounded-r hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next Page"
            title="Next Page"
          >
            <FcNext />
          </button>
        </div>
      </div>
      <table className="users-table">
        <thead>
          <tr>
            <th>Model</th>
            <th>Brand</th>
            <th>Type</th>
            <th>Vendor</th>
            <th>IP Address</th>
            <th>Serial Number</th>
            <th>Description</th>
            <th>Warranty Expiration</th>
          </tr>
        </thead>
        <tbody>
          {isAddingNetworkDevice && (
            <tr>
              <td>
                <input
                  type="text"
                  name="model"
                  value={newNetworkDevice.model}
                  placeholder="Enter Model"
                  onChange={handleInputChange}
                  className="center-placeholder"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="brand"
                  value={newNetworkDevice.brand}
                  placeholder="Enter Brand"
                  onChange={handleInputChange}
                  className="center-placeholder"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="type"
                  value={newNetworkDevice.type}
                  placeholder="Enter Type"
                  onChange={handleInputChange}
                  className="center-placeholder"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="vendor"
                  value={newNetworkDevice.vendor}
                  placeholder="Enter Vendor"
                  onChange={handleInputChange}
                  className="center-placeholder"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="ipAddress"
                  value={newNetworkDevice.ipAddress}
                  placeholder="Enter IP Address"
                  onChange={handleInputChange}
                  className="center-placeholder"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="serialNumber"
                  value={newNetworkDevice.serialNumber}
                  placeholder="Enter Serial Number"
                  onChange={handleInputChange}
                  className="center-placeholder"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="description"
                  value={newNetworkDevice.description}
                  placeholder="Enter Description"
                  onChange={handleInputChange}
                  className="center-placeholder"
                />
              </td>
              <td>
                <DatePicker
                  selected={newNetworkDevice.warrantyExpiration}
                  onChange={handleDateChange}
                  className="center-placeholder"
                  dateFormat="dd/MM/yyyy"
                />
              </td>
            </tr>
          )}
          {currentRows.map((networkDevice, index) => (
            <tr
              key={index}
              onClick={() => handleRowClick(networkDevice.id)}
              className={selectedNetworkDeviceId === networkDevice.id ? 'selected-row' : ''}
            >
              <td>
                {editableNetworkDeviceId === networkDevice.id ? (
                  <input
                    type="text"
                    name="model"
                    value={updatedNetworkDeviceData.model}
                    onChange={handleUpdateInputChange}
                  />
                ) : (
                  networkDevice.model
                )}
              </td>
              <td>
                {editableNetworkDeviceId === networkDevice.id ? (
                  <input
                    type="text"
                    name="brand"
                    value={updatedNetworkDeviceData.brand}
                    onChange={handleUpdateInputChange}
                  />
                ) : (
                  networkDevice.brand
                )}
              </td>
              <td>
                {editableNetworkDeviceId === networkDevice.id ? (
                  <input
                    type="text"
                    name="type"
                    value={updatedNetworkDeviceData.type}
                    onChange={handleUpdateInputChange}
                  />
                ) : (
                  networkDevice.type
                )}
              </td>
              <td>
                {editableNetworkDeviceId === networkDevice.id ? (
                  <input
                    type="text"
                    name="vendor"
                    value={updatedNetworkDeviceData.vendor}
                    onChange={handleUpdateInputChange}
                  />
                ) : (
                  networkDevice.vendor
                )}
              </td>
              <td>
                {editableNetworkDeviceId === networkDevice.id ? (
                  <input
                    type="text"
                    name="ipAddress"
                    value={updatedNetworkDeviceData.ipAddress}
                    onChange={handleUpdateInputChange}
                  />
                ) : (
                  networkDevice.ipAddress
                )}
              </td>
              <td>
                {editableNetworkDeviceId === networkDevice.id ? (
                  <input
                    type="text"
                    name="serialNumber"
                    value={updatedNetworkDeviceData.serialNumber}
                    onChange={handleUpdateInputChange}
                  />
                ) : (
                  networkDevice.serialNumber
                )}
              </td>
              <td>
                {editableNetworkDeviceId === networkDevice.id ? (
                  <input
                    type="text"
                    name="description"
                    value={updatedNetworkDeviceData.description}
                    onChange={handleUpdateInputChange}
                  />
                ) : (
                  networkDevice.description
                )}
              </td>
              <td>
                {editableNetworkDeviceId === networkDevice.id ? (
                  <DatePicker
                    selected={new Date(updatedNetworkDeviceData.warrantyExpiration)}
                    onChange={handleUpdateDateChange}
                    className="center-placeholder"
                    dateFormat="dd/MM/yyyy"
                  />
                ) : (
                  formatDate(networkDevice.warrantyExpiration)
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NetworkDevice;