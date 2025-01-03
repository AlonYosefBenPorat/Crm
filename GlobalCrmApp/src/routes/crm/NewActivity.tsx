import React, { useState, useEffect } from 'react';
import styles from '../../css/editActivity.module.scss';
import { TextField, Button, MenuItem } from '@mui/material';
import { usersService } from '../../services/usersService';
import { useTimer } from '../../helperFunction/timerHelper';
import { VscDebugStart, VscDebugPause, VscDebugStop } from 'react-icons/vsc';
import DigitalClock from '../../helperFunction/digitalClock';
import { addActivityToTicket } from '../../services/TicketServices';
import { useTicketContext } from '../../contexts/TicketContext';
import { showErrorDialog, showSuccessDialog } from '../../dialogs/dialogs';

const NewActivity = ({ open, onClose }) => {
  const { selectedTicket, refreshData } = useTicketContext();
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const { isRunning, isPaused, elapsedTime, startTimer, pauseTimer, resumeTimer, stopTimer, setElapsedTime } = useTimer();

  useEffect(() => {
    usersService.getUsers().then(setUsers);
  }, []);

  useEffect(() => {
    if (open) {
      const now = new Date();
      setDate(now.toISOString().split('T')[0]); // Set date in YYYY-MM-DD format
      setStartTime(now.toTimeString().split(' ')[0].slice(0, 5));
      const loggedOnUser = JSON.parse(localStorage.getItem('JwtToken'));
      if (loggedOnUser && loggedOnUser.userID) {
        setUsername(loggedOnUser.userID);
      }
      if (elapsedTime > 0) {
        resumeTimer(); // Resume the timer if it was previously running
      } else {
        startTimer(); // Start the timer when the form is opened for the first time
      }
    } else {
      pauseTimer(); // Pause the timer when the form is closed
    }
  }, [open]);

  useEffect(() => {
    if (elapsedTime > 0 && startTime) {
      const startDateTime = new Date();
      const [hours, minutes] = startTime.split(':');
      startDateTime.setHours(parseInt(hours, 10));
      startDateTime.setMinutes(parseInt(minutes, 10));
      const newEndTime = new Date(startDateTime.getTime() + elapsedTime * 1000);
      setEndTime(newEndTime.toISOString().slice(0, 16));
    }
  }, [elapsedTime, startTime]);

  const handleStopTimer = () => {
    const { startTime, endTime, elapsedTime } = stopTimer();
    const roundedElapsedTime = Math.ceil(elapsedTime / 60) * 60; // Round up to the nearest minute
    const endDateTime = new Date(startTime.getTime() + roundedElapsedTime * 1000);
    setStartTime(startTime ? startTime.toTimeString().split(' ')[0].slice(0, 5) : '');
    setEndTime(endDateTime ? endDateTime.toTimeString().split(' ')[0].slice(0, 5) : '');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedTicket || !selectedTicket.ticketId) {
      console.error('Ticket ID is undefined');
      return;
    }
    const formattedStartTime = `${date}T${startTime}:00Z`;
    const formattedEndTime = `${date}T${endTime}:00Z`;
    const newActivity = {
      ticketId: selectedTicket.ticketId,
      userId: username,
      description,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
    };
    try {
      console.log('Saving activity:', newActivity);
      await addActivityToTicket(selectedTicket.ticketId, newActivity);
      showSuccessDialog('Activity added successfully');
      await refreshData(); 
      onClose();
    } catch (error) {
      console.error('Error adding activity:', error);
      showErrorDialog('Failed to add activity');
    }
  };

  return (
    open && (
      <div className={styles.drawer} aria-labelledby="drawer-bottom-label">
        <div className={styles.drawerLarge}>
          <button type="button" onClick={onClose} className={styles.closeButton}>
            <svg className={styles.closeIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          <h5 id="drawer-bottom-label" className={styles.drawerLabel}>
            Add New Activity
          </h5>
          <div style={{ display: 'flex', alignItems: 'center', border: '3px solid #ccc', padding: '10px', borderRadius: '5px', marginBottom: '2rem' }}>
            <DigitalClock elapsedTime={elapsedTime} isPaused={isPaused} isRunning={isRunning} />
            <div className="timer-controls" style={{ display: 'flex', marginLeft: 'auto' }}>
              {isRunning && !isPaused ? (
                <div className="icon-wrapper" onClick={pauseTimer}>
                  <VscDebugPause className="icon-button" />
                </div>
              ) : (
                <div className="icon-wrapper" onClick={isPaused ? resumeTimer : startTimer}>
                  <VscDebugStart className="icon-button" />
                </div>
              )}
              <div className={`icon-wrapper ${!isRunning ? 'disabled' : ''}`} onClick={handleStopTimer}>
                <VscDebugStop className="icon-button" />
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <TextField
                select
                label="User"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                className={styles.textField}
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.firstName} {user.lastName}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                multiline
                rows={4}
                className={styles.textField}
              />
              <TextField
                label="Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                fullWidth
                className={styles.textField}
              />
              <div className={styles.timePicker}>
                <label>Start Time</label>
                <TextField
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  fullWidth
                  className={styles.textField}
                />
              </div>
              <div className={styles.timePicker}>
                <label>End Time</label>
                <TextField
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  fullWidth
                  className={styles.textField}
                />
              </div>
            </div>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={styles.saveButton}
              style={{ marginTop: '1rem' }}
            >
              Add Activity
            </Button>
          </form>
        </div>
      </div>
    )
  );
};

export default NewActivity;