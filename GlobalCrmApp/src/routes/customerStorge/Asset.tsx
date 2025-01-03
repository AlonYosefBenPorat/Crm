import React, { useEffect, useState } from "react";
import { getAssetData, addAssetData, deleteAssetData, updateAssetData } from "../../services/assetService";
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

interface AssetProps {
  onClose: () => void;
  customerId: string;
  customerName: string;
}

const Asset: React.FC<AssetProps> = ({ onClose, customerId, customerName }) => {
  const [isAddingAsset, setIsAddingAsset] = useState(false);
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newAsset, setNewAsset] = useState({
    type: '',
    ipAddress: '',
    url: '',
    license: '',
    supportExpiration: new Date(),
    notes: '',
    customerId: customerId
  });
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [editableAssetId, setEditableAssetId] = useState<string | null>(null);
  const [updatedAssetData, setUpdatedAssetData] = useState<any>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    refreshTable();
  }, [customerId]);

  useEffect(() => {
    const savedAssetId = localStorage.getItem('selectedAssetId');
    if (savedAssetId) {
      setSelectedAssetId(savedAssetId);
    }
  }, []);

  useEffect(() => {
    if (selectedAssetId) {
      localStorage.setItem('selectedAssetId', selectedAssetId);
    } else {
      localStorage.removeItem('selectedAssetId');
    }
  }, [selectedAssetId]);

  const refreshTable = async () => {
    setLoading(true);
    try {
      const assetData = await getAssetData(customerId);
      setAssets(assetData);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch asset data');
      setLoading(false);
    }
  };

  if (loading) {
    return <div><LoadingSpinner/></div>;
  }

  const handleAddItem = () => {
    setIsAddingAsset(!isAddingAsset);
    setNewAsset({
      type: '',
      ipAddress: '',
      url: '',
      license: '',
      supportExpiration: new Date(),
      notes: '',
      customerId: customerId
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAsset({ ...newAsset, [name]: value });
  };

  const handleDateChange = (date: Date) => {
    setNewAsset({ ...newAsset, supportExpiration: date });
  };

  const handleSaveAsset = async () => {
    try {
      console.log('Adding asset data:', newAsset); // Log the data being sent
      if (editableAssetId) {
        await updateAssetData(customerId, editableAssetId, updatedAssetData);
        showSuccessDialog('Asset updated successfully');
      } else {
        await addAssetData(customerId, newAsset);
        showSuccessDialog('Asset added successfully');
      }
      setIsAddingAsset(false);
      setEditableAssetId(null);
      setNewAsset({
        type: '',
        ipAddress: '',
        url: '',
        license: '',
        supportExpiration: new Date(),
        notes: '',
        customerId: customerId
      });
      refreshTable();
    } catch (error) {
      console.error('Error adding asset data:', error.response); // Log the error response
      setError('Failed to save asset');
      showErrorDialog('Failed to save asset');
    }
  };

  const handleRowClick = (assetId: string) => {
    if (selectedAssetId === assetId) {
      setSelectedAssetId(null);
    } else {
      setSelectedAssetId(assetId);
    }
  };

  const handleDeleteAsset = async () => {
    if (selectedAssetId) {
      try {
        await deleteAssetData(customerId, selectedAssetId);
        setSelectedAssetId(null);
        showSuccessDialog('Asset deleted successfully');
        refreshTable();
      } catch (error) {
        setError('Failed to delete asset');
        showErrorDialog('Failed to delete asset');
      }
    }
  };

  const handleEditClick = (assetId: string | null) => {
    if (editableAssetId === assetId) {
      setEditableAssetId(null);
      setUpdatedAssetData({});
    } else {
      setEditableAssetId(assetId);
      const asset = assets.find(as => as.id === assetId);
      setUpdatedAssetData({
        ...asset,
        supportExpiration: new Date(asset.supportExpiration)
      });
    }
  };

  const handleUpdateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedAssetData({
      ...updatedAssetData,
      [name]: value
    });
  };

  const handleUpdateDateChange = (date: Date) => {
    setUpdatedAssetData({
      ...updatedAssetData,
      supportExpiration: date
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
  const currentRows = assets.slice(indexOfFirstRow, indexOfLastRow);

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
              onClick={onClose} 
              title="Close" 
              className="icon-button" 
              aria-label="Close"
            />
          </li>
          <li>
            <RiMenuAddLine 
              onClick={handleAddItem} 
              className="icon-button" 
              title="Add Asset" 
              aria-label="Add Asset"
            />
          </li>
          <li>
            <TbUserEdit 
              onClick={() => handleEditClick(selectedAssetId)} 
              className="icon-button" 
              title="Edit Asset" 
              aria-label="Edit Asset"
            />
          </li>
          <li>
            <MdOutlineDeleteSweep 
              onClick={handleDeleteAsset} 
              className="icon-button" 
              title="Delete Asset" 
              aria-label="Delete Asset"
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
          {(isAddingAsset || editableAssetId) && (
            <li>
              <MdOutlineCloudUpload 
                className="icon-button" 
                onClick={handleSaveAsset} 
                title="Save Asset" 
                aria-label="Save Asset"
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
            disabled={indexOfLastRow >= assets.length}
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
            <th>Type</th>
            <th>IP Address</th>
            <th>URL</th>
            <th>License</th>
            <th>Support Expiration</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {isAddingAsset && (
            <tr>
              <td>
                <input
                  type="text"
                  name="type"
                  value={newAsset.type}
                  placeholder="Enter Type"
                  onChange={handleInputChange}
                  className="center-placeholder"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="ipAddress"
                  value={newAsset.ipAddress}
                  placeholder="Enter IP Address"
                  onChange={handleInputChange}
                  className="center-placeholder"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="url"
                  value={newAsset.url}
                  placeholder="Enter URL"
                  onChange={handleInputChange}
                  className="center-placeholder"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="license"
                  value={newAsset.license}
                  placeholder="Enter License"
                  onChange={handleInputChange}
                  className="center-placeholder"
                />
              </td>
              <td>
                <DatePicker
                  selected={newAsset.supportExpiration}
                  onChange={handleDateChange}
                  className="center-placeholder"
                  dateFormat="dd/MM/yyyy"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="notes"
                  value={newAsset.notes}
                  placeholder="Enter Notes"
                  onChange={handleInputChange}
                  className="center-placeholder"
                />
              </td>
            </tr>
          )}
          {currentRows.map((asset, index) => (
            <tr
              key={index}
              onClick={() => handleRowClick(asset.id)}
              className={selectedAssetId === asset.id ? 'selected-row' : ''}
            >
              <td>
                {editableAssetId === asset.id ? (
                  <input
                    type="text"
                    name="type"
                    value={updatedAssetData.type}
                    onChange={handleUpdateInputChange}
                  />
                ) : (
                  asset.type
                )}
              </td>
              <td>
                {editableAssetId === asset.id ? (
                  <input
                    type="text"
                    name="ipAddress"
                    value={updatedAssetData.ipAddress}
                    onChange={handleUpdateInputChange}
                  />
                ) : (
                  asset.ipAddress
                )}
              </td>
              <td>
                {editableAssetId === asset.id ? (
                  <input
                    type="text"
                    name="url"
                    value={updatedAssetData.url}
                    onChange={handleUpdateInputChange}
                  />
                ) : (
                  asset.url
                )}
              </td>
              <td>
                {editableAssetId === asset.id ? (
                  <input
                    type="text"
                    name="license"
                    value={updatedAssetData.license}
                    onChange={handleUpdateInputChange}
                  />
                ) : (
                  asset.license
                )}
              </td>
              <td>
                {editableAssetId === asset.id ? (
                  <DatePicker
                    selected={new Date(updatedAssetData.supportExpiration)}
                    onChange={handleUpdateDateChange}
                    className="center-placeholder"
                    dateFormat="dd/MM/yyyy"
                  />
                ) : (
                  formatDate(asset.supportExpiration)
                )}
              </td>
              <td>
                {editableAssetId === asset.id ? (
                  <input
                    type="text"
                    name="notes"
                    value={updatedAssetData.notes}
                    onChange={handleUpdateInputChange}
                  />
                ) : (
                  asset.notes
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Asset;