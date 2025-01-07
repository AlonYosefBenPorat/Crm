import React, { useContext, useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Container } from '@mui/material';
import { IoCloseSharp } from 'react-icons/io5';
import SubActivityTabs from './SubActivityTabs';
import EditActivity from './EditActivity';
import { getAllEmployees } from '../../services/EmployeeService';
import { updateTicket, closeTicket } from '../../services/TicketServices';
import Alert from '../../dialogs/alert';
import '../../css/ticketOpenModal.scss';
import NewActivity from './NewActivity';
import { showSuccessDialog } from '../../dialogs/dialogs';
import { CiAirportSign1, CiSaveUp2 } from 'react-icons/ci';
import { MdLibraryAddCheck } from 'react-icons/md';



interface TicketOpenModalProps {
  open: boolean;
  onClose: () => void;
  ticket: any;
  activities: any[];
  setActivities: (activities: any[]) => void;
  refreshData: (ticketId: string) => Promise<void>;
  updateKey: number;
   
}

const TicketOpenModal: React.FC<TicketOpenModalProps> = ({ open, onClose, ticket, activities, setActivities, refreshData, updateKey }) => {
  const [status, setStatus] = useState(ticket?.status);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(ticket?.employeeName || '');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(ticket?.employeeId || '');
  const [contactEmail, setContactEmail] = useState(ticket?.employeeEmail || '');
  const [contactPhone, setContactPhone] = useState(ticket?.employeePhone || '');
  const [tags, setTags] = useState(ticket?.hashTag || []);
  const [newTag, setNewTag] = useState('');
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'warning' } | null>(null);

  
  useEffect(() => {
    if (ticket) {
      setActivities(ticket.userActivities);
      setStatus(ticket.status);
      setSelectedEmployee(ticket.employeeName);
      setSelectedEmployeeId(ticket.employeeId);
      setContactEmail(ticket.employeeEmail);
      setContactPhone(ticket.employeePhone);
      setTags(ticket.hashTag);
    }
  }, [ticket, updateKey]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        console.log(`Fetching employees for customer ID: ${ticket.customerId}`);
        const employeeData = await getAllEmployees(ticket.customerId);
        setEmployees(employeeData);
      } catch (error) {
        console.error('Failed to fetch employees', error);
      }
    };

    if (ticket?.customerId) {
      fetchEmployees();
    }
  }, [ticket]);

  const handleEmployeeChange = (event) => {
    const selectedEmployeeName = event.target.value;
    setSelectedEmployee(selectedEmployeeName);
    const employee = employees.find(emp => emp.fullName === selectedEmployeeName);
    if (employee) {
      setSelectedEmployeeId(employee.employeeId);
      setContactEmail(employee.email);
      setContactPhone(employee.phone);
      console.log(`Selected Employee ID: ${employee.employeeId}`); 
    }
  };

  const handleTagDoubleClick = (index: number) => {
    const tagElement = document.getElementById(`tag-${index}`);
    if (tagElement) {
      tagElement.setAttribute('contentEditable', 'true');
      tagElement.focus();
    }
  };

  const handleTagBlur = (index: number) => {
    const tagElement = document.getElementById(`tag-${index}`);
    if (tagElement) {
      tagElement.setAttribute('contentEditable', 'false');
      const updatedTags = [...tags];
      updatedTags[index] = tagElement.innerText.replace(/^#/, ''); 
      setTags(updatedTags);
    }
  };

  const handleAddTag = (event) => {
    if (event.key === 'Enter' && newTag.trim() !== '') {
      const formattedTag = newTag.trim().replace(/^#/, ''); 
      if (!tags.includes(formattedTag)) {
        setTags([...tags, formattedTag]);
        setNewTag('');
      }
      event.preventDefault();
    }
  };

  const handleSave = async () => {
    try {
      const updatedTicket = {
        ...ticket, 
        employeeName: selectedEmployee,
        employeeEmail: contactEmail,
        employeePhone: contactPhone,
        status: status,
        hashTag: tags,
      };

      if (selectedEmployeeId !== ticket.employeeId) {
        updatedTicket.contactEmployeeId = selectedEmployeeId;
      }

      console.log(`Updated Ticket: ${JSON.stringify(updatedTicket)}`); 
      await updateTicket(ticket.ticketId, updatedTicket);
      await refreshData(ticket.ticketId);
      setAlert({ message: 'Ticket updated successfully', type: 'success' });
    } catch (error) {
      setAlert({ message: 'Failed to update ticket', type: 'warning' });
      console.error(`Failed to update ticket with ID ${ticket.ticketId}:`, error.response.data);
    }
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedActivity(null);
  };

  const refreshSelectedActivity = async () => {
    try {
      await refreshData(ticket.ticketId);
      setDrawerOpen(false);
      setSelectedActivity(null);
    } catch (error) {
      console.error('Error refreshing activity:', error);
    }
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setStatus(selectedValue);
  };

  const handleCloseTicket = async () => {
    try {
      await closeTicket(ticket.ticketId);
      setStatus('Closed');
     showSuccessDialog('Ticket closed successfully');
      refreshData(ticket.ticketId);
      onClose();
    } catch (error) {
      setAlert({ message: 'Failed to close ticket', type: 'warning' });
      console.error(`Failed to close ticket with ID ${ticket.ticketId}:`, error.response.data);
    }
  };

  if (!ticket) return null;

  return (

<Dialog className='dialog-container' open={open} onClose={onClose} maxWidth="lg" fullWidth>
  <DialogTitle className='dialog-title'>
    <IoCloseSharp onClick={onClose} className='text-left' aria-label='close Window' />
    <div className='text-center '>
      Customer Name: {ticket.customerName} | Ticket Number: {ticket.ticketId}
    </div>
    <div className="ticket-detail">
          <div className="button-status-container">
            <div className="status-container">
          <div>
            <strong>Status:</strong>
            <select value={status} onChange={handleStatusChange}>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Waiting For Client">Waiting For Client</option>
              <option value="Resolved">Closed</option>
            </select>
          </div>
        </div>
          </div>
          </div>
    <div className='button-container'>
        <MdLibraryAddCheck  title='Closed The Ticket' onClick={handleCloseTicket} className='icon-button'  aria-label='close-ticket'>
          Close 
        </MdLibraryAddCheck >  
        <CiSaveUp2 title='Save Ticket' onClick={handleSave} className='icon-button' aria-label='Save Ticket'>
          Save
              </CiSaveUp2>
            
          
        </div>
    <div className="section-divider"></div>
  </DialogTitle>
  <DialogContent>
    {alert && (
      <Alert
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert(null)}
      />
    )}
    <Container>
      <div className="ticket-info">
        <h3 className='text-center'>Ticket Subject: {ticket.subject}</h3>
        <div className="ticket-details">
          <div className="ticket-detail">
            <div>
              <strong>Contact Person:</strong>
              <select value={selectedEmployee} onChange={handleEmployeeChange}>
                {employees.map((employee) => (
                  <option key={employee.employeeId} value={employee.fullName}>
                    {employee.fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="ticket-detail">
            <div>
              <strong>Contact Phone:</strong> {contactPhone}
            </div>
          </div>
          <div className="ticket-detail">
            <div>
              <strong>Contact Email:</strong> {contactEmail}
            </div>
          </div>
          <div className="ticket-detail">
            <div>
              <strong>Open At:</strong>{' '}
              {new Date(ticket.createdAt).toLocaleString()}
            </div>
          </div>
          <div className="ticket-detail full-width">
            <div>
              <strong>Tags #:</strong>
              <div className="tags-container">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    id={`tag-${index}`}
                    className="tag"
                    onDoubleClick={() => handleTagDoubleClick(index)}
                  >
                    #{tag}
                  </div>
                ))}
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Add a tag"
                  className="tag-input"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

          <div className="section-divider"></div>
          <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', marginTop: '1px' }}>
            <CiSaveUp2 onClick={handleSave} className='icon-button' aria-label='Save' title='Save'></CiSaveUp2>
          </div>

      <div className="user-activity">
        <div className="activity-content">
          <SubActivityTabs ticket={ticket} activities={activities} refreshData={refreshData} refreshActivity={refreshSelectedActivity} />
        </div>
      </div>
     
    </Container>
  </DialogContent>
  <DialogActions>
  </DialogActions>
  {drawerOpen && (
    <>
      <EditActivity
        activity={selectedActivity}
            onClose={handleCloseDrawer}
            open={true}
      />
      <NewActivity
        open={true}
            onClose={handleCloseDrawer}
            ticketId={ticket.ticketId}
            
          />
       
    </>
  )}
</Dialog>
   
  );
};

export default TicketOpenModal;