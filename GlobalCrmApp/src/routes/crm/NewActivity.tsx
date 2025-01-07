import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, IconButton } from '@mui/material';
import { VscDebugStart, VscDebugPause, VscDebugStop } from 'react-icons/vsc';
import { MdClose, MdDownloadDone } from 'react-icons/md';
import { usersService } from '../../services/usersService';
import { useTimer } from '../../helperFunction/timerHelper';
import DigitalClock from '../../helperFunction/digitalClock';
import { addActivityToTicket } from '../../services/TicketServices';
import { useTicketContext } from '../../contexts/TicketContext';
import { showErrorDialog, showSuccessDialog } from '../../dialogs/dialogs';
import '../../css/editActivity.module.scss';

const NewActivity = ({ open, onClose, ticketId }) => {
  const { refreshData } = useTicketContext();
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const { isRunning, isPaused, elapsedTime, startTimer, pauseTimer, resumeTimer, stopTimer } = useTimer();

  useEffect(() => {
    usersService.getUsers().then(setUsers);
  }, []);

  useEffect(() => {
    if (open) {
      const now = new Date();
      setDate(now.toISOString().split('T')[0]);
      setStartTime(now.toTimeString().split(' ')[0].slice(0, 5));
      const loggedOnUser = JSON.parse(localStorage.getItem('JwtToken'));
      if (loggedOnUser && loggedOnUser.userID) {
        setUsername(loggedOnUser.userID);
      }
      startTimer();
    } else {
      pauseTimer();
      resetForm();
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
    const roundedElapsedTime = Math.ceil(elapsedTime / 60) * 60;
    const endDateTime = new Date(startTime.getTime() + roundedElapsedTime * 1000);
    setStartTime(startTime ? startTime.toTimeString().split(' ')[0].slice(0, 5) : '');
    setEndTime(endDateTime ? endDateTime.toTimeString().split(' ')[0].slice(0, 5) : '');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!ticketId) {
      console.error('Ticket ID is undefined');
      return;
    }
    const formattedStartTime = `${date}T${startTime}:00Z`;
    const formattedEndTime = `${date}T${endTime}:00Z`;
    const newActivity = {
      ticketId,
      userId: username,
      description,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
    };
    try {
      await addActivityToTicket(ticketId, newActivity);
      showSuccessDialog('Activity added successfully');
      await refreshData();
      onClose();
    } catch (error) {
      console.error('Error adding activity:', error);
      showErrorDialog('Failed to add activity');
    }
  };

  const resetForm = () => {
    const loggedOnUser = JSON.parse(localStorage.getItem('JwtToken'));
   
    setDescription('');
    setDate('');
    setStartTime('');
    setEndTime('');
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="new-activity-dialog-title" maxWidth="sm" fullWidth>
      <DialogTitle id="new-activity-dialog-title">
        Add New Activity
        <IconButton aria-label="close" onClick={onClose} style={{ position: 'absolute', right: 8, top: 8 }}>
          <MdClose />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
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
          <div className="formGroup">
            <div className="field-wrapper">
              <label>User</label>
              <TextField
                select
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                className="textField"
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.firstName} {user.lastName}
                  </MenuItem>
                ))}
              </TextField>
            </div>
            <div className="field-wrapper">
              <label>Description</label>
              <TextField
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                multiline
                rows={4}
                className="textField"
              />
            </div>
            <div className="field-wrapper">
              <label>Date</label>
              <TextField
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                fullWidth
                className="textField"
              />
            </div>
            <div className="field-wrapper">
              <label>Start Time</label>
              <TextField
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                fullWidth
                className="textField"
              />
            </div>
            <div className="field-wrapper">
              <label>End Time</label>
              <TextField
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                fullWidth
                className="textField"
              />
            </div>
          </div>
          <DialogActions>
            <IconButton aria-label="add activity" onClick={handleSubmit} className="icon-button">
              <MdDownloadDone />
            </IconButton>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewActivity;