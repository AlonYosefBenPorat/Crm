import React, { useEffect, useState } from 'react';
import { Select, MenuItem, TextField, SelectChangeEvent } from '@mui/material';
import { RiDeleteBin5Line, RiRefreshLine } from 'react-icons/ri';
import { MdAddCard } from 'react-icons/md';
import '../css/ticketToolbar.scss';
import { getAllCustomers } from '../services/customerSerivce';
import { usersService } from '../services/usersService';
import { getTicketById } from '../services/TicketServices';
import { jwtDecode } from 'jwt-decode';


interface TicketToolbarProps {
  onNewTicket: () => void;
  onDeleteTicket: () => void;
  onCustomerChange: (customerId: string | null) => void;
  onUserChange: (userFullName: string | null) => void;
  onSearchTermChange: (searchTerm: string) => void;
  onTicketNumberChange: (ticket: any) => void; 
}

const TicketToolbar: React.FC<TicketToolbarProps> = ({ onNewTicket, onDeleteTicket, onCustomerChange, onUserChange, onSearchTermChange, onTicketNumberChange }) => {
  const token = localStorage.getItem('JwtToken');
  let isGlobalAdmin = false;

  if (token) {
    const decodedToken: any = jwtDecode(token);
    isGlobalAdmin = decodedToken.role === 'GlobalAdmin';
  }

  const [customers, setCustomers] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('all');
  const [ticketNumber, setTicketNumber] = useState('');

  
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const customers = await getAllCustomers();
        setCustomers(customers);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await usersService.getUsers();
        setUsers(users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCustomerChange = (event: SelectChangeEvent<string>) => {
    const customerId = event.target.value as string;
    onCustomerChange(customerId === 'all' ? null : customerId);
  };

  const handleUserChange = (event: SelectChangeEvent<string>) => {
    const userId = event.target.value as string;
    setSelectedUserId(userId);

    if (userId === 'all') {
      onUserChange(null);
    } else {
      const selectedUser = users.find(user => user.id === userId);
      if (selectedUser) {
        const userFullName = `${selectedUser.firstName} ${selectedUser.lastName}`;
        onUserChange(userFullName);
      }
    }
  };

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    onSearchTermChange(searchTerm);
  };

  const handleTicketNumberChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const ticketNumber = e.target.value;
    setTicketNumber(ticketNumber);
    if (ticketNumber) {
      try {
        const ticket = await getTicketById(ticketNumber);
        onTicketNumberChange(ticket); 
      } catch (error) {
        console.error('Error fetching ticket:', error);
      }
    } else {
      onTicketNumberChange(null); 
    }
  };

    return (
    <div className="ticket-toolbar">
      <div className="search-section">
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchTermChange}
          className="search-field"
          aria-label="Search"
          title="Search"
        />
      </div>

      <div className="toolbar-row">
        <div className="left-section">
          <Select
            defaultValue="all"
            onChange={handleCustomerChange}
            displayEmpty
            className="select-customer"
            aria-label="Select Customer"
            title="Select Customer"
          >
            <MenuItem value="all">
              All Customers
            </MenuItem>
            {filteredCustomers.map((customer) => (
              <MenuItem key={customer.id} value={customer.id}>
                {customer.name}
              </MenuItem>
            ))}
          </Select>

          <Select
            defaultValue="all"
            onChange={handleUserChange}
            displayEmpty
            className="select-user"
            aria-label="Select User"
            title="Select User"
          >
            <MenuItem value="all">
              Select Users
            </MenuItem>
            {filteredUsers.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </MenuItem>
            ))}
          </Select>

          <TextField
            label="Ticket Number"
            variant="outlined"
            size="small"
            value={ticketNumber}
            onChange={handleTicketNumberChange}
            className="ticket-number-field"
            aria-label="Ticket Number"
            title="Ticket Number"
          />
        </div>

        <div className="right-section">
          <RiRefreshLine className="icon-button" onClick={() => console.log('Refresh')} aria-label="Refresh" title="Refresh" />
          <MdAddCard className="icon-button" onClick={onNewTicket} aria-label="New Ticket" title="New Ticket" />
          {isGlobalAdmin && (
            <RiDeleteBin5Line className="icon-button" onClick={onDeleteTicket} aria-label="Delete Ticket" title="Delete Ticket" />
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketToolbar;