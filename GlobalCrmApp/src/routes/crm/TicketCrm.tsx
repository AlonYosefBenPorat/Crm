import React, { useEffect, useState, useContext } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, FormControlLabel } from '@mui/material';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import OpenNewTicket from './OpenNewTicket';
import TicketOpenModal from './TicketOpenModal';
import { showSuccessDialog, showErrorDialog } from '../../dialogs/dialogs';
import { addTicket, deleteTicket } from '../../services/TicketServices';
import TicketToolbar from '../../components/TicketToolbar';
import Spinner from '../../components/Spinner';
import { useTicketContext } from '../../contexts/TicketContext';
import { DarkModeContext } from '../../contexts/DarkModeContext';
import '../../css/ticketCrm.scss';

const TicketCrm: React.FC = () => {
  const { tickets, selectedTicket, activities, setSelectedTicket, setActivities, refreshData } = useTicketContext();
  const { darkMode } = useContext(DarkModeContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openNewTicketModal, setOpenNewTicketModal] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [openTicketModal, setOpenTicketModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [updateKey, setUpdateKey] = useState(0);
  
  const rowsPerPage = 10;

  useEffect(() => {
    refreshData().then(() => setLoading(false));
  }, []);

  const handleNewTicket = () => {
    setOpenNewTicketModal(true);
  };

  const handleCloseNewTicketModal = () => {
    setOpenNewTicketModal(false);
  };

  const handleSaveNewTicket = async (ticketData: any) => {
    try {
      await addTicket(ticketData);
      showSuccessDialog('Ticket added successfully');
      refreshData();
    } catch (error) {
      showErrorDialog('Failed to add ticket');
    }
  };

  const handleDeleteTicket = async () => {
    if (!selectedTicketId) return;
    try {
      await deleteTicket(selectedTicketId);
      showSuccessDialog('Ticket deleted successfully');
      refreshData();
    } catch (error) {
      showErrorDialog('Failed to delete ticket');
    }
  };

  const handleRowClick = (ticketId: string) => {
    if (selectedTicketId === ticketId) {
      setSelectedTicketId(null);
    } else {
      setSelectedTicketId(ticketId);
    }
  };

  const handleRowDoubleClick = (ticketId: string) => {
    const ticket = tickets.find((t) => t.ticketId === ticketId);
    setSelectedTicket(ticket);
    setActivities(ticket.userActivities);
    setOpenTicketModal(true);
  };

  const handleCloseTicketModal = () => {
    setOpenTicketModal(false);
    setSelectedTicket(null);
  };

  const handleCustomerChange = (customerId: string) => {
    setSelectedCustomer(customerId);
  };

  const handleUserChange = (userId: string) => {
    setSelectedUser(userId);
  };

  const handleSearchTermChange = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  const handleShowAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowAll(event.target.checked);
    setCurrentPage(1);
  };

  const handleTicketNumberChange = (ticket: any) => {
    if (ticket) {
      setFilteredTickets([ticket]);
    } else {
      setFilteredTickets([]);
    }
  };

  const filteredTicketsList = filteredTickets.length > 0 ? filteredTickets : tickets.filter(ticket => {
    const matchesCustomer = selectedCustomer ? ticket.customerId === selectedCustomer : true;
    const matchesUser = selectedUser ? (
      (ticket.assignedToFirstName + ' ' + ticket.assignedToLastName).toLowerCase().includes(selectedUser.toLowerCase())
    ) : true;
    const matchesSearchTerm = searchTerm ? (
      String(ticket.ticketId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(ticket.status).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(ticket.subject).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(ticket.title).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(ticket.customerName).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(ticket.hashtag).toLowerCase().includes(searchTerm.toLowerCase())
    ) : true;
    return matchesCustomer && matchesUser && matchesSearchTerm;
  });

  const totalPages = Math.ceil(filteredTicketsList.length / rowsPerPage);
  const displayedTickets = showAll ? filteredTicketsList : filteredTicketsList.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
  };

  if (loading) {
    return <div><Spinner /></div>;
  }

  return (
    <>
      <TicketToolbar
        onNewTicket={handleNewTicket}
        onDeleteTicket={handleDeleteTicket}
        onCustomerChange={handleCustomerChange}
        onUserChange={handleUserChange}
        onSearchTermChange={handleSearchTermChange}
        onTicketNumberChange={handleTicketNumberChange}
      />

      <TableContainer component={Paper} className={`table-container ${darkMode ? 'dark-mode' : ''}`}>
        <Table className="table">
          <TableHead>
            <TableRow>
              <TableCell>Ticket Number</TableCell>
              <TableCell>Open At</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Last Update</TableCell>
              <TableCell>User Assigned</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedTickets.length > 0 ? (
              displayedTickets.map((ticket) => (
                <TableRow key={ticket.ticketId}
                  onClick={() => handleRowClick(ticket.ticketId)}
                  onDoubleClick={() => handleRowDoubleClick(ticket.ticketId)}
                  selected={selectedTicketId === ticket.ticketId}
                  style={{
                    cursor: 'pointer',
                    backgroundColor: selectedTicketId === ticket.ticketId ? 'lightblue' : 'transparent',
                    fontWeight: selectedTicketId === ticket.ticketId ? 'bold' : 'normal'
                  }}
                >
                  <TableCell>{ticket.ticketId}</TableCell>
                  <TableCell>{new Date(ticket.createdAt).toLocaleDateString('en-GB')}</TableCell>
                  <TableCell>{ticket.status}</TableCell>
                  <TableCell>{ticket.customerName}</TableCell>
                  <TableCell>{ticket.title}</TableCell>
                  <TableCell>{ticket.subject}</TableCell>
                  <TableCell>{new Date(ticket.createdAt).toLocaleDateString('en-GB')}</TableCell>
                  <TableCell>{ticket.assignedToFirstName} {ticket.assignedToLastName}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No tickets available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
        <FormControlLabel
          control={<Checkbox checked={showAll} onChange={handleShowAllChange} />}
          label="Show All"
        />
        {!showAll && (
          <>
            <RiArrowLeftSLine aria-label='Previous Page' className='icon-button' onClick={handlePreviousPage} />
            <span>Page {currentPage} of {totalPages}</span>
            <RiArrowRightSLine aria-label='Next Page' className='icon-button' onClick={handleNextPage}  />
          </>
        )}
      </div>
      <OpenNewTicket
        open={openNewTicketModal}
        onClose={handleCloseNewTicketModal}
        onSave={handleSaveNewTicket}
      />
      <TicketOpenModal
        open={openTicketModal}
        onClose={handleCloseTicketModal}
        ticket={selectedTicket}
        activities={activities}
        setActivities={setActivities}
        refreshData={refreshData}
        updateKey={updateKey}
        
      />
    </>
  );
};

export default TicketCrm;