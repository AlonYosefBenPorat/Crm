import React, { useEffect, useState } from "react";
import { getServerData, addServerData, deleteServerData, updateServerData } from '../../services/serverService';
import { LoadingSpinner } from "../../components/Spinner";
import { CgMinimizeAlt } from "react-icons/cg";
import { RiMenuAddLine } from "react-icons/ri";
import { GiReturnArrow } from "react-icons/gi";
import { MdOutlineCloudUpload, MdOutlineDeleteSweep } from "react-icons/md";
import { showErrorDialog, showSuccessDialog } from "../../dialogs/dialogs";
import '../../css/table.scss';
import { TbUserEdit } from "react-icons/tb";
import { FcNext, FcPrevious } from "react-icons/fc";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface ServerProps {
  onMinimize: () => void;
  customerId: string;
  customerName: string;
}

const Server: React.FC<ServerProps> = ({ onMinimize, customerId }) => {
  const [isAddingServer, setIsAddingServer] = useState(false);
  const [servers, setServers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newServer, setNewServer] = useState({
    ipAddress: '',
    hostname: '',
    serialNumber: '',
    model: '',
    vendor: '',
    type: '',
    ram: '',
    storage: '',
    operatingSystem: '',
    roles: '',
    warrantyExpiration: new Date()
  });
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);
  const [editableServerId, setEditableServerId] = useState<string | null>(null);
  const [updatedServerData, setUpdatedServerData] = useState<any>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    refreshTable();
  }, [customerId]);

  useEffect(() => {
    const savedServerId = localStorage.getItem('selectedServerId');
    if (savedServerId) {
      setSelectedServerId(savedServerId);
    }
  }, []);

  useEffect(() => {
    if (selectedServerId) {
      localStorage.setItem('selectedServerId', selectedServerId);
    } else {
      localStorage.removeItem('selectedServerId');
    }
  }, [selectedServerId]);

  const refreshTable = async () => {
    setLoading(true);
    try {
      const serverData = await getServerData(customerId);
      setServers(serverData);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch server data');
      setLoading(false);
    }
  };

  if (loading) {
    return <div><LoadingSpinner/></div>;
  }

  const handleAddItem = () => {
    setIsAddingServer(!isAddingServer);
    setNewServer({
      ipAddress: '',
      hostname: '',
      serialNumber: '',
      model: '',
      vendor: '',
      type: '',
      ram: '',
      storage: '',
      operatingSystem: '',
      roles: '',
      warrantyExpiration: new Date()
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewServer({ ...newServer, [name]: value });
  };

  const handleDateChange = (date: Date) => {
    setNewServer({ ...newServer, warrantyExpiration: date });
  };

  const handleSaveServer = async () => {
    try {
      if (editableServerId) {
        await updateServerData(customerId, editableServerId, updatedServerData);
        showSuccessDialog('Server updated successfully');
      } else {
        await addServerData(customerId, newServer);
        showSuccessDialog('Server added successfully');
      }
      setIsAddingServer(false);
      setEditableServerId(null);
      setNewServer({
        ipAddress: '',
        hostname: '',
        serialNumber: '',
        model: '',
        vendor: '',
        type: '',
        ram: '',
        storage: '',
        operatingSystem: '',
        roles: '',
        warrantyExpiration: new Date()
      });
      refreshTable();
    } catch (error) {
      setError('Failed to save server');
      showErrorDialog('Failed to save server- c missing Write permissions- contact admin');
    }
  };

  const handleRowClick = (serverId: string) => {
    if (selectedServerId === serverId) {
      setSelectedServerId(null);
    } else {
      setSelectedServerId(serverId);
    }
  };

  const handleDeleteServer = async () => {
    if (selectedServerId) {
      try {
        await deleteServerData(customerId, selectedServerId);
        setSelectedServerId(null);
        showSuccessDialog('Server deleted successfully');
        refreshTable();
      } catch (error) {
        setError('Failed to delete server');
        showErrorDialog('Failed to delete server, missing Delete permissions- contact admin');
      }
    }
  };

  const handleEditClick = (serverId: string | null) => {
    if (editableServerId === serverId) {
      setEditableServerId(null);
      setUpdatedServerData({});
    } else {
      setEditableServerId(serverId);
      const server = servers.find(srv => srv.id === serverId);
      setUpdatedServerData({
        ...server,
        warrantyExpiration: new Date(server.warrantyExpiration)
      });
    }
  };

  const handleUpdateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedServerData({
      ...updatedServerData,
      [name]: value
    });
  };

  const handleUpdateDateChange = (date: Date) => {
    setUpdatedServerData({
      ...updatedServerData,
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
  const currentRows = servers.slice(indexOfFirstRow, indexOfLastRow);

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
              title="Add Server" 
              aria-label="Add Server"
            />
          </li>
          <li>
            <TbUserEdit 
              onClick={() => handleEditClick(selectedServerId)} 
              className="icon-button" 
              title="Edit Server" 
              aria-label="Edit Server"
            />
          </li>
          <li>
            <MdOutlineDeleteSweep 
              onClick={handleDeleteServer} 
              className="icon-button" 
              title="Delete Server" 
              aria-label="Delete Server"
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
          {(isAddingServer || editableServerId) && (
            <li>
              <MdOutlineCloudUpload 
                className="icon-button" 
                onClick={handleSaveServer} 
                title="Save Server" 
                aria-label="Save Server"
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
       <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className='icon-button'
            aria-label="Previous Page"
            title="Previous Page"
          >
            <FcPrevious />
          </button>
          <button
            onClick={handleNextPage}
            disabled={indexOfLastRow >= servers.length}
            className='icon-button'
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
            <th>IP Address</th>
            <th>Hostname</th>
            <th>Serial Number</th>
            <th>Model</th>
            <th>Vendor</th>
            <th>Type</th>
            <th>RAM</th>
            <th>Storage</th>
            <th>Operating System</th>
            <th>Roles</th>
            <th>Warranty Expiration</th>
          </tr>
        </thead>
        <tbody>
          {isAddingServer && (
            <tr>
              <td>
                <input
                  type="text"
                  name="ipAddress"
                  value={newServer.ipAddress}
                  placeholder="Enter IP Address"
                  onChange={handleInputChange}
                  className="center-placeholder"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="hostname"
                  value={newServer.hostname}
                  placeholder="Enter Hostname"
                  onChange={handleInputChange}
                  className="center-placeholder"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="serialNumber"
                  value={newServer.serialNumber}
                  placeholder="Enter Serial Number"
                  onChange={handleInputChange}
                  className="center-placeholder"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="model"
                  value={newServer.model}
                  placeholder="Enter Model"
                  onChange={handleInputChange}
                  className="center-placeholder"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="vendor"
                  value={newServer.vendor}
                  placeholder="Enter vendor"
                  onChange={handleInputChange}
                  className="center-placeholder"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="type"
                  value={newServer.type}
                  placeholder="Enter Type"
                  onChange={handleInputChange}
                  className="center-placeholder"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="ram"
                  value={newServer.ram}
                  placeholder="Enter RAM"
                  onChange={handleInputChange}
                  className="center-placeholder"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="storage"
                  value={newServer.storage}
                  placeholder="Enter Storage"
                  onChange={handleInputChange}
                  className="center-placeholder"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="operatingSystem"
                  value={newServer.operatingSystem}
                  placeholder="Enter Operating System"
                  onChange={handleInputChange}
                  className="center-placeholder"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="roles"
                  value={newServer.roles}
                  placeholder="Enter Roles"
                  onChange={handleInputChange}
                  className="center-placeholder"
                />
              </td>
              <td>
                <DatePicker
                  selected={newServer.warrantyExpiration}
                  onChange={handleDateChange}
                  className="center-placeholder"
                />
              </td>
            </tr>
          )}
          {currentRows.map((server, index) => (
            <tr
              key={index}
              onClick={() => handleRowClick(server.id)}
              className={selectedServerId === server.id ? 'selected-row' : ''}
            >
              <td>
                {editableServerId === server.id ? (
                  <input
                    type="text"
                    name="ipAddress"
                    value={updatedServerData.ipAddress}
                    onChange={handleUpdateInputChange}
                  />
                ) : (
                  server.ipAddress
                )}
              </td>
              <td>
                {editableServerId === server.id ? (
                  <input
                    type="text"
                    name="hostname"
                    value={updatedServerData.hostname}
                    onChange={handleUpdateInputChange}
                  />
                ) : (
                  server.hostname
                )}
              </td>
              <td>
                {editableServerId === server.id ? (
                  <input
                    type="text"
                    name="serialNumber"
                    value={updatedServerData.serialNumber}
                    onChange={handleUpdateInputChange}
                  />
                ) : (
                  server.serialNumber
                )}
              </td>
              <td>
                {editableServerId === server.id ? (
                  <input
                    type="text"
                    name="model"
                    value={updatedServerData.model}
                    onChange={handleUpdateInputChange}
                  />
                ) : (
                  server.model
                )}
              </td>
              <td>
                {editableServerId === server.id ? (
                  <input
                    type="text"
                    name="vendor"
                    value={updatedServerData.vendor}
                    onChange={handleUpdateInputChange}
                  />
                ) : (
                  server.vendor
                )}
              </td>
              <td>
                {editableServerId === server.id ? (
                  <input
                    type="text"
                    name="type"
                    value={updatedServerData.type}
                    onChange={handleUpdateInputChange}
                  />
                ) : (
                  server.type
                )}
              </td>
              <td>
                {editableServerId === server.id ? (
                  <input
                    type="text"
                    name="ram"
                    value={updatedServerData.ram}
                    onChange={handleUpdateInputChange}
                  />
                ) : (
                  server.ram
                )}
              </td>
              <td>
                {editableServerId === server.id ? (
                  <input
                    type="text"
                    name="storage"
                    value={updatedServerData.storage}
                    onChange={handleUpdateInputChange}
                  />
                ) : (
                  server.storage
                )}
              </td>
              <td>
                {editableServerId === server.id ? (
                  <input
                    type="text"
                    name="operatingSystem"
                    value={updatedServerData.operatingSystem}
                    onChange={handleUpdateInputChange}
                  />
                ) : (
                  server.operatingSystem
                )}
              </td>
              <td>
                {editableServerId === server.id ? (
                  <input
                    type="text"
                    name="roles"
                    value={updatedServerData.roles}
                    onChange={handleUpdateInputChange}
                  />
                ) : (
                  server.roles
                )}
              </td>
              <td>
                {editableServerId === server.id ? (
                  <DatePicker
                    selected={updatedServerData.warrantyExpiration}
                    onChange={handleUpdateDateChange}
                    className="center-placeholder"
                  />
                ) : (
                  new Date(server.warrantyExpiration).toLocaleDateString()
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Server;