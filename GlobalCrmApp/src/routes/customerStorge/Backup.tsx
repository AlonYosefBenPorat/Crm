import React, { useEffect, useState } from "react";
import { getBackupData, addBackupData, deleteBackupData, updateBackupData } from "../../services/backupService";
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

interface BackupProps {
  onMinimize: () => void;
  customerId: string;
}

const Backup: React.FC<BackupProps> = ({ onMinimize, customerId }) => {
  const [isAddingBackup, setIsAddingBackup] = useState(false);
  const [backups, setBackups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newBackup, setNewBackup] = useState({
    backupProvider: '',
    backupData: '',
    rpo: '',
    rto: '',
    backupStorge: '',
    backupEncrypted: false,
    backupRetntion: '',
    capacity: 0,
    lastRestore: new Date(),
    customerId: customerId
  });
  const [selectedBackupId, setSelectedBackupId] = useState<string | null>(null);
  const [editableBackupId, setEditableBackupId] = useState<string | null>(null);
  const [updatedBackupData, setUpdatedBackupData] = useState<any>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    refreshTable();
  }, [customerId]);

  useEffect(() => {
    const savedBackupId = localStorage.getItem('selectedBackupId');
    if (savedBackupId) {
      setSelectedBackupId(savedBackupId);
    }
  }, []);

  useEffect(() => {
    if (selectedBackupId) {
      localStorage.setItem('selectedBackupId', selectedBackupId);
    } else {
      localStorage.removeItem('selectedBackupId');
    }
  }, [selectedBackupId]);

  const refreshTable = async () => {
    setLoading(true);
    try {
      const backupData = await getBackupData(customerId);
      setBackups(backupData);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch backup data');
      setLoading(false);
    }
  };

  if (loading) {
    return <div><LoadingSpinner/></div>;
  }

  const handleAddItem = () => {
    setIsAddingBackup(!isAddingBackup);
    setNewBackup({
      backupProvider: '',
      backupData: '',
      rpo: '',
      rto: '',
      backupStorge: '',
      backupEncrypted: false,
      backupRetntion: '',
      capacity: 0,
      lastRestore: new Date(),
      customerId: customerId
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewBackup({ ...newBackup, [name]: name === 'capacity' ? Number(value) : value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNewBackup({ ...newBackup, [name]: checked });
  };

  const handleDateChange = (date: Date) => {
    setNewBackup({ ...newBackup, lastRestore: date });
  };

  const handleSaveBackup = async () => {
    try {
      console.log('Adding backup data:', newBackup); // Log the data being sent
      if (editableBackupId) {
        await updateBackupData(customerId, editableBackupId, updatedBackupData);
        showSuccessDialog('Backup updated successfully');
      } else {
        await addBackupData(customerId, newBackup);
        showSuccessDialog('Backup added successfully');
      }
      setIsAddingBackup(false);
      setEditableBackupId(null);
      setNewBackup({
        backupProvider: '',
        backupData: '',
        rpo: '',
        rto: '',
        backupStorge: '',
        backupEncrypted: false,
        backupRetntion: '',
        capacity: 0,
        lastRestore: new Date(),
        customerId: customerId
      });
      refreshTable();
    } catch (error) {
      console.error('Error adding backup data:', error.response); // Log the error response
      setError('Failed to save backup');
      showErrorDialog('Failed to save backup');
    }
  };

  const handleRowClick = (backupId: string) => {
    if (selectedBackupId === backupId) {
      setSelectedBackupId(null);
    } else {
      setSelectedBackupId(backupId);
    }
  };

  const handleDeleteBackup = async () => {
    if (selectedBackupId) {
      try {
        await deleteBackupData(customerId, selectedBackupId);
        setSelectedBackupId(null);
        showSuccessDialog('Backup deleted successfully');
        refreshTable();
      } catch (error) {
        setError('Failed to delete backup');
        showErrorDialog('Failed to delete backup');
      }
    }
  };

  const handleEditClick = (backupId: string | null) => {
    if (editableBackupId === backupId) {
      setEditableBackupId(null);
      setUpdatedBackupData({});
    } else {
      setEditableBackupId(backupId);
      const backup = backups.find(bk => bk.id === backupId);
      setUpdatedBackupData({
        ...backup,
        lastRestore: new Date(backup.lastRestore)
      });
    }
  };

  const handleUpdateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedBackupData({
      ...updatedBackupData,
      [name]: name === 'capacity' ? Number(value) : value
    });
  };

  const handleUpdateCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setUpdatedBackupData({
      ...updatedBackupData,
      [name]: checked
    });
  };

  const handleUpdateDateChange = (date: Date) => {
    setUpdatedBackupData({
      ...updatedBackupData,
      lastRestore: date
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
  const currentRows = backups.slice(indexOfFirstRow, indexOfLastRow);

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
              className="icon" 
              aria-label="Minimize"
            />
          </li>
          <li>
            <RiMenuAddLine 
              onClick={handleAddItem} 
              className="icon-button" 
              title="Add Backup" 
              aria-label="Add Backup"
            />
          </li>
          <li>
            <TbUserEdit 
              onClick={() => handleEditClick(selectedBackupId)} 
              className="icon-button" 
              title="Edit Backup" 
              aria-label="Edit Backup"
            />
          </li>
          <li>
            <MdOutlineDeleteSweep 
              onClick={handleDeleteBackup} 
              className="icon-button" 
              title="Delete Backup" 
              aria-label="Delete Backup"
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
          {(isAddingBackup || editableBackupId) && (
            <li>
              <MdOutlineCloudUpload 
                className="icon-button" 
                onClick={handleSaveBackup} 
                title="Save Backup" 
                aria-label="Save Backup"
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
            disabled={indexOfLastRow >= backups.length}
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
            <th>Backup Provider</th>
            <th>Backup Data</th>
            <th>RPO</th>
            <th>RTO</th>
            <th>Backup Storage</th>
            <th>Backup Encrypted</th>
            <th>Backup Retention</th>
            <th>Capacity</th>
            <th>Last Restore</th>
          </tr>
        </thead>
        <tbody>
          {isAddingBackup && (
            <tr>
              <td>
                <input
                  type="text"
                  name="backupProvider"
                  value={newBackup.backupProvider}
                  placeholder="Enter Backup Provider"
                  onChange={handleInputChange}
                  className="center-placeholder"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="backupData"
                  value={newBackup.backupData}
                  placeholder="Enter Backup Data"
                  onChange={handleInputChange}
                  className="center-placeholder"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="rpo"
                  value={newBackup.rpo}
                  placeholder="Enter RPO"
                  onChange={handleInputChange}
                  className="center-placeholder"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="rto"
                  value={newBackup.rto}
                  placeholder="Enter RTO"
                  onChange={handleInputChange}
                  className="center-placeholder"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="backupStorge"
                  value={newBackup.backupStorge}
                  placeholder="Enter Backup Storage"
                  onChange={handleInputChange}
                  className="center-placeholder"
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="backupEncrypted"
                  checked={newBackup.backupEncrypted}
                  onChange={handleCheckboxChange}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="backupRetntion"
                  value={newBackup.backupRetntion}
                  placeholder="Enter Backup Retention"
                  onChange={handleInputChange}
                  className="center-placeholder"
                />
              </td>
              <td>
                <input
                  type="number"
                  name="capacity"
                  value={newBackup.capacity}
                  placeholder="Enter Capacity"
                  onChange={handleInputChange}
                  className="center-placeholder"
                />
              </td>
              <td>
                <DatePicker
                  selected={newBackup.lastRestore}
                  onChange={handleDateChange}
                  className="center-placeholder"
                  dateFormat="dd/MM/yyyy"
                />
              </td>
            </tr>
          )}
          {currentRows.map((backup, index) => (
            <tr
              key={index}
              onClick={() => handleRowClick(backup.id)}
              className={selectedBackupId === backup.id ? 'selected-row' : ''}
            >
              <td>
                {editableBackupId === backup.id ? (
                  <input
                    type="text"
                    name="backupProvider"
                    value={updatedBackupData.backupProvider}
                    onChange={handleUpdateInputChange}
                  />
                ) : (
                  backup.backupProvider
                )}
              </td>
              <td>
                {editableBackupId === backup.id ? (
                  <input
                    type="text"
                    name="backupData"
                    value={updatedBackupData.backupData}
                    onChange={handleUpdateInputChange}
                  />
                ) : (
                  backup.backupData
                )}
              </td>
              <td>
                {editableBackupId === backup.id ? (
                  <input
                    type="text"
                    name="rpo"
                    value={updatedBackupData.rpo}
                    onChange={handleUpdateInputChange}
                  />
                ) : (
                  backup.rpo
                )}
              </td>
              <td>
                {editableBackupId === backup.id ? (
                  <input
                    type="text"
                    name="rto"
                    value={updatedBackupData.rto}
                    onChange={handleUpdateInputChange}
                  />
                ) : (
                  backup.rto
                )}
              </td>
              <td>
                {editableBackupId === backup.id ? (
                  <input
                    type="text"
                    name="backupStorge"
                    value={updatedBackupData.backupStorge}
                    onChange={handleUpdateInputChange}
                  />
                ) : (
                  backup.backupStorge
                )}
              </td>
              <td>
                {editableBackupId === backup.id ? (
                  <input
                    type="checkbox"
                    name="backupEncrypted"
                    checked={updatedBackupData.backupEncrypted}
                    onChange={handleUpdateCheckboxChange}
                  />
                ) : (
                  backup.backupEncrypted ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />
                )}
              </td>
              <td>
                {editableBackupId === backup.id ? (
                  <input
                    type="text"
                    name="backupRetntion"
                    value={updatedBackupData.backupRetntion}
                    onChange={handleUpdateInputChange}
                  />
                ) : (
                  backup.backupRetntion
                )}
              </td>
              <td>
                {editableBackupId === backup.id ? (
                  <input
                    type="number"
                    name="capacity"
                    value={updatedBackupData.capacity}
                    onChange={handleUpdateInputChange}
                  />
                ) : (
                  backup.capacity
                )}
              </td>
              <td>
                {editableBackupId === backup.id ? (
                  <DatePicker
                    selected={new Date(updatedBackupData.lastRestore)}
                    onChange={handleUpdateDateChange}
                    className="center-placeholder"
                    dateFormat="dd/MM/yyyy"
                  />
                ) : (
                  formatDate(backup.lastRestore)
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Backup;