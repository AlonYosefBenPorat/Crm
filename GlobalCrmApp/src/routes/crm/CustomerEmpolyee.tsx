import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { getAllEmployees } from '../../services/EmployeeService'; // Adjust the import path as needed

interface Employee {
  fullName: string;
  email: string;
  phone: string;
  isActive: boolean;
  jobTitle: string;
}

const CustomerEmployee = ({ customerId }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await getAllEmployees(customerId);
        setEmployees(response);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    if (customerId) {
      fetchEmployees();
    }
  }, [customerId]);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Full Name</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Phone</TableCell>
          <TableCell>Active</TableCell>
          <TableCell>Job Title</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {employees.map(employee => (
          <TableRow key={employee.email}>
            <TableCell>{employee.fullName}</TableCell>
            <TableCell>{employee.email}</TableCell>
            <TableCell>{employee.phone}</TableCell>
            <TableCell>{employee.isActive ? 'Yes' : 'No'}</TableCell>
            <TableCell>{employee.jobTitle}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CustomerEmployee;