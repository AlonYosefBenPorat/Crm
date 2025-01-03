import React, { useEffect, useState } from "react";
import { addEmployee, getAllEmployees, deleteEmployee, updateEmployeeStatus, updateEmployee } from "../../services/EmployeeService";
import { LoadingSpinner } from "../../components/Spinner";
import { CgMinimizeAlt } from "react-icons/cg";
import { RiMenuAddLine } from "react-icons/ri";
import { GiReturnArrow } from "react-icons/gi";
import { MdOutlineCloudUpload, MdOutlineDeleteSweep } from "react-icons/md";
import { FaCheck, FaTimes } from "react-icons/fa";
import { showErrorDialog, showSuccessDialog } from "../../dialogs/dialogs";
import '../../css/table.scss'; // Ensure this import is present to include your CSS
import { TbUserEdit } from "react-icons/tb";
import { FcNext, FcPrevious } from "react-icons/fc";

interface EmployeeProps {
  onMinimize: () => void;
  customerId: string;
  
}

const Employee: React.FC<EmployeeProps> = ({ onMinimize, customerId }) => {
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newEmployee, setNewEmployee] = useState({ fullName: '', email: '', phone: '', jobTitle: '', isActive: false });
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [editableEmployeeId, setEditableEmployeeId] = useState<string | null>(null);
  const [updatedEmployeeData, setUpdatedEmployeeData] = useState<any>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    refreshTable();
  }, [customerId]);

  useEffect(() => {
    const savedEmployeeId = localStorage.getItem('selectedEmployeeId');
    if (savedEmployeeId) {
      setSelectedEmployeeId(savedEmployeeId);
    }
  }, []);

  useEffect(() => {
    if (selectedEmployeeId) {
      localStorage.setItem('selectedEmployeeId', selectedEmployeeId);
    } else {
      localStorage.removeItem('selectedEmployeeId');
    }
  }, [selectedEmployeeId]);

  const refreshTable = async () => {
    setLoading(true);
    try {
      console.log('Fetching data for customer ID:', customerId); 
      const employeeData = await getAllEmployees(customerId);
      setEmployees(employeeData);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch employee data');
      setLoading(false);
    }
  };

  if (loading) {
    return <div><LoadingSpinner/></div>;
  }

  const handleAddItem = () => {
    setIsAddingEmployee(!isAddingEmployee);
    setNewEmployee({ fullName: '', email: '', phone: '', jobTitle: '', isActive: true });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name]: value === 'true' });
  };

  const handleSaveEmployee = async () => {
    try {
      if (editableEmployeeId) {
        await updateEmployee(customerId, editableEmployeeId, updatedEmployeeData);
        showSuccessDialog('Employee updated successfully');
      } else {
        await addEmployee(customerId, newEmployee);
        showSuccessDialog('Employee added successfully');
      }
      setIsAddingEmployee(false);
      setEditableEmployeeId(null);
      setNewEmployee({ fullName: '', email: '', phone: '', jobTitle: '', isActive: false });
      refreshTable();
    } catch (error) {
      setError('Failed to save employee');
      showErrorDialog('Failed to save employee');
    }
  };

  const handleRowClick = (employeeId: string) => {
    if (selectedEmployeeId === employeeId) {
      setSelectedEmployeeId(null);
    } else {
      setSelectedEmployeeId(employeeId);
    }
  };

  const handleDeleteEmployee = async () => {
    if (selectedEmployeeId) {
      try {
        await deleteEmployee(customerId, selectedEmployeeId);
        setSelectedEmployeeId(null);
        showSuccessDialog('Employee deleted successfully');
        refreshTable();
      } catch (error) {
        setError('Failed to delete employee');
        showErrorDialog('Failed to delete employee');
      }
    }
  };

  const handleStatusChange = async (employeeId: string, newStatus: boolean) => {
    try {
      await updateEmployeeStatus(customerId, employeeId, newStatus);
      showSuccessDialog('Employee status updated successfully');
      refreshTable();
    } catch (error) {
      setError('Failed to update employee status');
      showErrorDialog('Failed to update employee status');
    }
  };

  const handleEditClick = (employeeId: string | null) => {
  if (editableEmployeeId === employeeId) {
    // If the same employee is clicked again, close the edit mode
    setEditableEmployeeId(null);
    setUpdatedEmployeeData({});
  } else {
    // Open the edit mode for the selected employee
    setEditableEmployeeId(employeeId);
    const employee = employees.find(emp => emp.employeeId === employeeId);
    setUpdatedEmployeeData(employee);
  }
};


  const handleUpdateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedEmployeeData({
      ...updatedEmployeeData,
      [name]: value
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
  const currentRows = employees.slice(indexOfFirstRow, indexOfLastRow);

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
              title="Add Employee" 
              aria-label="Add Employee"
            />
          </li>
          <li>
            <TbUserEdit 
              onClick={() => handleEditClick(selectedEmployeeId)} 
              className="icon-button" 
              title="Edit Employee" 
              aria-label="Edit Employee"
            />
          </li>
          <li>
            <MdOutlineDeleteSweep 
              onClick={handleDeleteEmployee} 
              className="icon-button" 
              title="Delete Employee" 
              aria-label="Delete Employee"
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
          {(isAddingEmployee || editableEmployeeId) && (
            <li>
              <MdOutlineCloudUpload 
                className="icon-button" 
                onClick={handleSaveEmployee} 
                title="Save Employee" 
                aria-label="Save Employee"
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
            disabled={indexOfLastRow >= employees.length}
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
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Job Title</th>
            <th>Active</th>
          </tr>
        </thead>
        <tbody>
          {isAddingEmployee && (
            <tr>
              <td>
                <input
                  type="text"
                  name="fullName"
                  value={newEmployee.fullName}
                  placeholder="Enter full name"
                  onChange={handleInputChange}
                  className="center-placeholder"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="email"
                  value={newEmployee.email}
                  placeholder="Enter email"
                  onChange={handleInputChange}
                  className="center-placeholder"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="phone"
                  value={newEmployee.phone}
                  placeholder="Enter phone number"
                  onChange={handleInputChange}
                  className="center-placeholder"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="jobTitle"
                  value={newEmployee.jobTitle}
                  placeholder="Enter job title"
                  onChange={handleInputChange}
                  className="center-placeholder"
                />
              </td>
              <td>
                <select
                  name="isActive"
                  value={newEmployee.isActive ? 'true' : 'false'}
                  onChange={handleSelectChange}
                  className="center-placeholder"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </td>
            </tr>
          )}
          {currentRows.map((employee, index) => (
            <tr
              key={index}
              onClick={() => handleRowClick(employee.employeeId)}
              className={selectedEmployeeId === employee.employeeId ? 'selected-row' : ''}
            >
              <td>
                {editableEmployeeId === employee.employeeId ? (
                  <input
                    type="text"
                    name="fullName"
                    value={updatedEmployeeData.fullName}
                    onChange={handleUpdateInputChange}
                  />
                ) : (
                  employee.fullName
                )}
              </td>
              <td>
                {editableEmployeeId === employee.employeeId ? (
                  <input
                    type="text"
                    name="email"
                    value={updatedEmployeeData.email}
                    onChange={handleUpdateInputChange}
                  />
                ) : (
                  employee.email
                )}
              </td>
              <td>
                {editableEmployeeId === employee.employeeId ? (
                  <input
                    type="text"
                    name="phone"
                    value={updatedEmployeeData.phone}
                    onChange={handleUpdateInputChange}
                  />
                ) : (
                  employee.phone
                )}
              </td>
              <td>
                {editableEmployeeId === employee.employeeId ? (
                  <input
                    type="text"
                    name="jobTitle"
                    value={updatedEmployeeData.jobTitle}
                    onChange={handleUpdateInputChange}
                  />
                ) : (
                  employee.jobTitle
                )}
              </td>
              <td className="status-icon" onClick={() => handleStatusChange(employee.employeeId, !employee.isActive)}>
                {employee.isActive ? (
                  <FaCheck className="text-green-500" aria-label="Active" title="Active" />
                ) : (
                  <FaTimes className="text-red-500" aria-label="Inactive" title="Inactive" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Employee;