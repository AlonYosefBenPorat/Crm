import React, { useEffect, useState } from "react";
import { getFirewallData, addFirewallData, deleteFirewallData, updateFirewallData } from "../../services/firewallService";
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

interface GatwayProps {
  onMinimize: () => void;
  onClose: () => void;
  customerId: string;
  customerName: string;
}

const Gatway: React.FC<GatwayProps> = ({ onMinimize, customerId }) => {
  const [isAddingFirewall, setIsAddingFirewall] = useState(false);
  const [firewalls, setFirewalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newFirewall, setNewFirewall] = useState({
    brand: '',
    version: '',
    model: '',
    serialNumber: '',
    ipAddress: '',
    macAddress: '',
    license: new Date(),
    isActive: false,
    notes: '',
    customerId: customerId
  });
  const [selectedFirewallId, setSelectedFirewallId] = useState<string | null>(null);
  const [editableFirewallId, setEditableFirewallId] = useState<string | null>(null);
  const [updatedFirewallData, setUpdatedFirewallData] = useState<any>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    refreshTable();
  }, [customerId]);

  useEffect(() => {
    const savedFirewallId = localStorage.getItem('selectedFirewallId');
    if (savedFirewallId) {
      setSelectedFirewallId(savedFirewallId);
    }
  }, []);

  useEffect(() => {
    if (selectedFirewallId) {
      localStorage.setItem('selectedFirewallId', selectedFirewallId);
    } else {
      localStorage.removeItem('selectedFirewallId');
    }
  }, [selectedFirewallId]);

  const refreshTable = async () => {
    setLoading(true);
    try {
      const firewallData = await getFirewallData(customerId);
      setFirewalls(firewallData);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch firewall data');
      setLoading(false);
    }
  };

  if (loading) {
    return <div><LoadingSpinner/></div>;
  }

  const handleAddItem = () => {
    setIsAddingFirewall(!isAddingFirewall);
    setNewFirewall({
      brand: '',
      version: '',
      model: '',
      serialNumber: '',
      ipAddress: '',
      macAddress: '',
      license: new Date(),
      isActive: false,
      notes: '',
      customerId: customerId
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewFirewall({ ...newFirewall, [name]: value });
  };

  const handleDateChange = (date: Date) => {
    setNewFirewall({ ...newFirewall, license: date });
  };

  const handleSaveFirewall = async () => {
    try {
      if (editableFirewallId) {
        await updateFirewallData(customerId, editableFirewallId, updatedFirewallData);
        showSuccessDialog('Firewall updated successfully');
      } else {
        await addFirewallData(customerId, newFirewall);
        showSuccessDialog('Firewall added successfully');
      }
      setIsAddingFirewall(false);
      setEditableFirewallId(null);
      setNewFirewall({
        brand: '',
        version: '',
        model: '',
        serialNumber: '',
        ipAddress: '',
        macAddress: '',
        license: new Date(),
        isActive: false,
        notes: '',
        customerId: customerId
      });
      refreshTable();
    } catch (error) {
      setError('Failed to save firewall');
      showErrorDialog('Failed to save firewall');
    }
  };

  const handleRowClick = (firewallId: string) => {
    if (selectedFirewallId === firewallId) {
      setSelectedFirewallId(null);
    } else {
      setSelectedFirewallId(firewallId);
    }
  };

  const handleDeleteFirewall = async () => {
    if (selectedFirewallId) {
      try {
        await deleteFirewallData(customerId, selectedFirewallId);
        setSelectedFirewallId(null);
        showSuccessDialog('Firewall deleted successfully');
        refreshTable();
      } catch (error) {
        setError('Failed to delete firewall');
        showErrorDialog('Failed to delete firewall');
      }
    }
  };

  const handleEditClick = (firewallId: string | null) => {
    if (editableFirewallId === firewallId) {
      setEditableFirewallId(null);
      setUpdatedFirewallData({});
    } else {
      setEditableFirewallId(firewallId);
      const firewall = firewalls.find(fw => fw.id === firewallId);
      setUpdatedFirewallData({
        ...firewall,
        license: new Date(firewall.license)
      });
    }
  };

  const handleUpdateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedFirewallData({
      ...updatedFirewallData,
      [name]: value
    });
  };

  const handleUpdateDateChange = (date: Date) => {
    setUpdatedFirewallData({
      ...updatedFirewallData,
      license: date
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
  const currentRows = firewalls.slice(indexOfFirstRow, indexOfLastRow);

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
              title="Add Firewall" 
              aria-label="Add Firewall"
            />
          </li>
          <li>
            <TbUserEdit 
              onClick={() => handleEditClick(selectedFirewallId)} 
              className="icon-button" 
              title="Edit Firewall" 
              aria-label="Edit Firewall"
            />
          </li>
          <li>
            <MdOutlineDeleteSweep 
              onClick={handleDeleteFirewall} 
              className="icon-button" 
              title="Delete Firewall" 
              aria-label="Delete Firewall"
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
          {(isAddingFirewall || editableFirewallId) && (
            <li>
              <MdOutlineCloudUpload 
                className="icon-button" 
                onClick={handleSaveFirewall} 
                title="Save Firewall" 
                aria-label="Save Firewall"
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
            className="icon-button"
            aria-label="Previous Page"
            title="Previous Page"
          >
            <FcPrevious />
          </button>
          <button
            onClick={handleNextPage}
            disabled={indexOfLastRow >= firewalls.length}
           className="icon-button"
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
            <th>Brand</th>
            <th>Version</th>
            <th>Model</th>
            <th>Serial Number</th>
            <th>IP Address</th>
            <th>MAC Address</th>
            <th>License</th>
            <th>Active</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {isAddingFirewall && (
            <tr>
              <td>
                <input
                  type="text"
                  name="brand"
                  value={newFirewall.brand}
                  placeholder="Enter Brand"
                  onChange={handleInputChange}
                  className="center-placeholder"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="version"
                  value={newFirewall.version}
                  placeholder="Enter Version"
                  onChange={handleInputChange}
                  className="center-placeholder"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="model"
                  value={newFirewall.model}
                  placeholder="Enter Model"
                  onChange={handleInputChange}
                  className="center-placeholder"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="serialNumber"
                  value={newFirewall.serialNumber}
                  placeholder="Enter Serial Number"
                  onChange={handleInputChange}
                  className="center-placeholder"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="ipAddress"
                  value={newFirewall.ipAddress}
                  placeholder="Enter IP Address"
                  onChange={handleInputChange}
                  className="center-placeholder"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="macAddress"
                  value={newFirewall.macAddress}
                  placeholder="Enter MAC Address"
                  onChange={handleInputChange}
                  className="center-placeholder"
                />
              </td>
              <td>
                <DatePicker
                  selected={newFirewall.license}
                  onChange={handleDateChange}
                  className="center-placeholder"
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={newFirewall.isActive}
                  onChange={(e) => setNewFirewall({ ...newFirewall, isActive: e.target.checked })}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="notes"
                  value={newFirewall.notes}
                  placeholder="Enter Notes"
                  onChange={handleInputChange}
                  className="center-placeholder"
                />
              </td>
            </tr>
          )}
          {currentRows.map((firewall, index) => (
            <tr
              key={index}
              onClick={() => handleRowClick(firewall.id)}
              className={selectedFirewallId === firewall.id ? 'selected-row' : ''}
            >
              <td>
                {editableFirewallId === firewall.id ? (
                  <input
                    type="text"
                    name="brand"
                    value={updatedFirewallData.brand}
                    onChange={handleUpdateInputChange}
                  />
                ) : (
                  firewall.brand
                )}
              </td>
              <td>
                {editableFirewallId === firewall.id ? (
                  <input
                    type="text"
                    name="version"
                    value={updatedFirewallData.version}
                    onChange={handleUpdateInputChange}
                  />
                ) : (
                  firewall.version
                )}
              </td>
              <td>
                {editableFirewallId === firewall.id ? (
                  <input
                    type="text"
                    name="model"
                    value={updatedFirewallData.model}
                    onChange={handleUpdateInputChange}
                  />
                ) : (
                  firewall.model
                )}
              </td>
              <td>
                {editableFirewallId === firewall.id ? (
                  <input
                    type="text"
                    name="serialNumber"
                    value={updatedFirewallData.serialNumber}
                    onChange={handleUpdateInputChange}
                  />
                ) : (
                  firewall.serialNumber
                )}
              </td>
              <td>
                {editableFirewallId === firewall.id ? (
                  <input
                    type="text"
                    name="ipAddress"
                    value={updatedFirewallData.ipAddress}
                    onChange={handleUpdateInputChange}
                  />
                ) : (
                  firewall.ipAddress
                )}
              </td>
              <td>
                {editableFirewallId === firewall.id ? (
                  <input
                    type="text"
                    name="macAddress"
                    value={updatedFirewallData.macAddress}
                    onChange={handleUpdateInputChange}
                  />
                ) : (
                  firewall.macAddress
                )}
              </td>
              <td>
                {editableFirewallId === firewall.id ? (
                  <DatePicker
                    selected={new Date(updatedFirewallData.license)}
                    onChange={handleUpdateDateChange}
                    className="center-placeholder"
                  />
                ) : (
                  new Date(firewall.license).toLocaleDateString()
                )}
              </td>
              <td>
                {editableFirewallId === firewall.id ? (
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={updatedFirewallData.isActive}
                    onChange={(e) => setUpdatedFirewallData({ ...updatedFirewallData, isActive: e.target.checked })}
                  />
                ) : (
                  firewall.isActive ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />
                )}
              </td>
              <td>
                {editableFirewallId === firewall.id ? (
                  <input
                    type="text"
                    name="notes"
                    value={updatedFirewallData.notes}
                    onChange={handleUpdateInputChange}
                  />
                ) : (
                  firewall.notes
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Gatway;