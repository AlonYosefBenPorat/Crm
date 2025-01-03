import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { AiOutlineFolderAdd } from 'react-icons/ai';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { LuRefreshCcw } from "react-icons/lu";
import { formatDate, formatTime } from '../../helperFunction/formatDate';
import EditActivity from './EditActivity';
import NewActivity from './NewActivity';
import { useTicketContext } from '../../contexts/TicketContext';
import { deleteUserActivity } from '../../services/TicketServices';
import { showDeleteConfirmation } from '../../dialogs/dialogs';

const calculateDuration = (startTime: string, endTime: string) => {
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 'Invalid Date';
  }

  const durationMs = end.getTime() - start.getTime();
  const durationMinutes = Math.floor(durationMs / 60000);
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

const calculateTotalDuration = (activities) => {
  let totalMinutes = 0;

  activities.forEach(activity => {
    const start = new Date(activity.startTime);
    const end = new Date(activity.endTime);

    if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
      const durationMs = end.getTime() - start.getTime();
      totalMinutes += Math.floor(durationMs / 60000);
    }
  });

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

const TicketActivity = () => {
  const { activities, refreshData, selectedTicket } = useTicketContext();
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [reloadKey, setReloadKey] = useState(0); // State variable to trigger re-render
  const [newActivityOpen, setNewActivityOpen] = useState(false); // State for NewActivity modal

  useEffect(() => {
    console.log('TicketActivity mounted or updated');
    console.log('Activities:', activities);
    refreshData();
  }, [selectedActivity]);

  const handleRowClick = (index: number, activity: any) => {
    console.log('Row clicked:', activity);
    setSelectedRow(index);
    localStorage.setItem('selectedActivity', JSON.stringify(activity));
  };

  const handleRowDoubleClick = (activity: any) => {
    console.log('Row double clicked:', activity);
    setSelectedActivity(activity);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    console.log('Closing drawer');
    setDrawerOpen(false);
    setSelectedActivity(null);
    refreshData();
  };

  const handleRefreshData = async () => {
    
    await refreshData(); 
    setReloadKey((prevKey) => prevKey + 1); 
  };

  const handleOpenNewActivity = () => {
    setNewActivityOpen(true);
  };

  const handleCloseNewActivity = () => {
    setNewActivityOpen(false);
  };

  const handleDeleteActivity = async () => {
  const activity = JSON.parse(localStorage.getItem('selectedActivity'));
  if (activity) {
    console.log('Deleting activity:', activity);
    try {
      await deleteUserActivity(activity.ticketId, activity.userActivityId);
      showDeleteConfirmation();
      await refreshData();

    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  }
};

  const totalDuration = calculateTotalDuration(activities);

  return (
    <div className="relative" key={reloadKey}>
      <div className="button-container">
        <AiOutlineFolderAdd aria-label='Add Activity' title='Add Activity' className="icon-button-square" onClick={handleOpenNewActivity} />
        <RiDeleteBin5Line aria-label='Delete selected Activity' title='Delete selected Activity' className="icon-button-square" onClick={handleDeleteActivity} />
        <LuRefreshCcw aria-label='Refresh Activity' title='Refresh Activity' className="icon-button-square" onClick={handleRefreshData} />
        <h4 className="total-time-box">Total time: {totalDuration}</h4>
      </div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>User Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Duration</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activities.map((activity, index) => (
              <TableRow
                key={index}
                onClick={() => handleRowClick(index, activity)}
                onDoubleClick={() => handleRowDoubleClick(activity)}
                style={{ backgroundColor: selectedRow === index ? 'lightblue' : 'inherit' }}
              >
                <TableCell>{activity.userActivityId}</TableCell>
                <TableCell>{activity.firstName} {activity.lastName}</TableCell>
                <TableCell>{activity.description}</TableCell>
                <TableCell>{formatDate(activity.startTime)}</TableCell>
                <TableCell>{formatTime(activity.startTime)}</TableCell>
                <TableCell>{formatTime(activity.endTime)}</TableCell>
                <TableCell>{calculateDuration(activity.startTime, activity.endTime)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {drawerOpen && <EditActivity activity={selectedActivity} onClose={handleCloseDrawer} refreshData={refreshData} />}
      <NewActivity open={newActivityOpen} onClose={handleCloseNewActivity} ticketId={selectedTicket.ticketId} refreshData={refreshData} />
    </div>
  );
};

export default TicketActivity;