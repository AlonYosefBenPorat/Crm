import React, { useState, useEffect } from 'react';
import styles from '../../css/editActivity.module.scss';
import { TextField, Button, MenuItem } from '@mui/material';
import { updateUserActivity } from '../../services/TicketServices';
import { usersService } from '../../services/usersService';
import { useTicketContext } from '../../contexts/TicketContext';

const EditActivity = ({ activity, onClose}) => {
   const { refreshData } = useTicketContext();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(activity.userId);
  const [description, setDescription] = useState(activity.description);
  const [date, setDate] = useState(activity.startTime.split('T')[0]);
  const [startTime, setStartTime] = useState(activity.startTime.split('T')[1].slice(0, 5));
  const [endTime, setEndTime] = useState(activity.endTime.split('T')[1].slice(0, 5));
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    usersService.getUsers().then(setUsers);
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const updatedActivity = {
      userActivityId: activity.userActivityId,
      ticketId: activity.ticketId,
      userId: selectedUser,
      description,
      startTime: `${date}T${startTime}:00`,
      endTime: `${date}T${endTime}:00`,
    };
    try {
      console.log('Saving activity:', updatedActivity);
      await updateUserActivity(activity.ticketId, activity.userActivityId, updatedActivity);
      setShowSuccess(true);
      setTimeout(async () => {
        setShowSuccess(false);
        await refreshData();
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Error updating activity:', error);
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
    }
  };

  return (
    <div className={styles.drawer} aria-labelledby="drawer-bottom-label">
      <div className={styles.drawerLarge}>
        <button type="button" onClick={onClose} className={styles.closeButton}>
          <svg className={styles.closeIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <h5 id="drawer-bottom-label" className={styles.drawerLabel}>
          Edit Activity
        </h5>
        {showSuccess && <div className={styles.alertSuccess}>Activity updated successfully!</div>}
        {showError && <div className={styles.alertError}>Failed to update activity.</div>}
        <form onSubmit={handleSave}>
          <div className={styles.formGroup}>
            <TextField
              select
              label="User"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
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
            <TextField
              label="Start Time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              fullWidth
              className={styles.textField}
            />
            <TextField
              label="End Time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              fullWidth
              className={styles.textField}
            />
          </div>
          <Button
  type="submit"
  variant="contained"
  color="primary"
  className={styles.saveButton}
  style={{ marginTop: '1rem' }} // Add margin-bottom
>
  Save
</Button>
        </form>
      </div>
    </div>
  );
};

export default EditActivity;