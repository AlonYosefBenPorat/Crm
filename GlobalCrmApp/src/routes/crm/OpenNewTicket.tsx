import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { getAllCustomers } from '../../services/customerSerivce';
import { getAllEmployees } from '../../services/EmployeeService';
import { usersService } from '../../services/usersService';

interface OpenNewTicketProps {
  open: boolean;
  onClose: () => void;
  onSave: (ticketData: any) => void;
}

const OpenNewTicket: React.FC<OpenNewTicketProps> = ({ open, onClose, onSave }) => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [hashTags, setHashTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const customerData = await getAllCustomers();
        setCustomers(customerData);
      } catch (error) {
        console.error('Failed to fetch customers', error);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      const fetchEmployees = async () => {
        try {
          console.log(`Fetching employees for customer ID: ${selectedCustomer}`);
          const employeeData = await getAllEmployees(selectedCustomer);
          setEmployees(employeeData);
        } catch (error) {
          console.error('Failed to fetch employees', error);
        }
      };

      fetchEmployees();
    } else {
      setEmployees([]); 
    }
  }, [selectedCustomer]);

  const fetchUsers = async () => {
    try {
      const data = await usersService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!open) {
      setSelectedCustomer('');
      setSelectedEmployee('');
      setSelectedUser('');
      setTitle('');
      setSubject('');
      setDescription('');
      setHashTags([]);
    }
  }, [open]);

  const handleSave = () => {
    const selectedCustomerName = customers.find(customer => customer.id === selectedCustomer)?.name;
    const selectedEmployeeName = employees.find(employee => employee.id === selectedEmployee)?.fullName;
    const ticketData = {
      title,
      subject,
      description,
      status: 'New',
      isOpen: true,
      customerName: selectedCustomerName,
      customerId: selectedCustomer,
      employeeName: selectedEmployeeName,
      contactEmployeeId: selectedEmployee,
      assignedTo: selectedUser,
      hashTag: hashTags,
    };
    console.log('Saving ticket with data:', ticketData); // Log the ticket data
    onSave(ticketData);
    onClose();
  };

  const handleHashTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHashTags(event.target.value.split(',').map(tag => tag.trim()));
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Open New Ticket</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel>Customer</InputLabel>
          <Select
            value={selectedCustomer || ''}
            onChange={(e) => setSelectedCustomer(e.target.value as string)}
          >
            {customers.map((customer) => (
              <MenuItem key={customer.id} value={customer.id}>
                {customer.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Employee</InputLabel>
          <Select
            value={selectedEmployee || ''}
            onChange={(e) => {
              console.log('Selected employee:', e.target.value); // Log the selected employee
              setSelectedEmployee(e.target.value as string);
            }}
            disabled={!selectedCustomer}
          >
            {employees.map((employee) => (
              <MenuItem key={employee.employeeId} value={employee.employeeId}>
                {employee.fullName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Assigned To</InputLabel>
          <Select
            value={selectedUser || ''}
            onChange={(e) => setSelectedUser(e.target.value as string)}
          >
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          margin="normal"
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={4}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Hash Tags (comma separated)"
          value={hashTags.join(', ')}
          onChange={handleHashTagChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OpenNewTicket;