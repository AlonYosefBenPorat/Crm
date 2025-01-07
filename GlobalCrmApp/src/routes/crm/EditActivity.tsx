import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, IconButton } from '@mui/material';
import { updateUserActivity } from '../../services/TicketServices';
import { usersService } from '../../services/usersService';
import { useTicketContext } from '../../contexts/TicketContext';
import { MdClose, MdOutlineCancelPresentation } from 'react-icons/md';
import '../../css/editActivity.module.scss';
import { BsCloudUpload } from 'react-icons/bs';

const EditActivity = ({ activity, open, onClose }) => {
  const { refreshData } = useTicketContext();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(activity ? activity.userId : '');
  const [description, setDescription] = useState(activity ? activity.description : '');
  const [date, setDate] = useState(activity ? activity.startTime.split('T')[0] : '');
  const [startTime, setStartTime] = useState(activity ? activity.startTime.split('T')[1].slice(0, 5) : '');
  const [endTime, setEndTime] = useState(activity ? activity.endTime.split('T')[1].slice(0, 5) : '');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    usersService.getUsers().then(setUsers);
  }, []);

  useEffect(() => {
    if (activity) {
      setSelectedUser(activity.userId);
      setDescription(activity.description);
      setDate(activity.startTime.split('T')[0]);
      setStartTime(activity.startTime.split('T')[1].slice(0, 5));
      setEndTime(activity.endTime.split('T')[1].slice(0, 5));
    }
  }, [activity]);

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
      await updateUserActivity(activity.ticketId, activity.userActivityId, updatedActivity);
      setShowSuccess(true);
      setTimeout(async () => {
        setShowSuccess(false);
        await refreshData();
        onClose();
      }, 1000);
    } catch (error) {
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="edit-activity-dialog-title"
      maxWidth="md"
      fullWidth
      sx={{ '& .MuiDialog-paper': { height: '60vh' } }}
    >
      <DialogTitle id="edit-activity-dialog-title">
        Edit Activity
        <IconButton aria-label="close" onClick={onClose} style={{ position: 'absolute', right: 8, top: 8 }}>
          <MdClose />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers className="dialogContent">
        {showSuccess && <div className="alertSuccess">Activity updated successfully!</div>}
        {showError && <div className="alertError">Failed to update activity.</div>}
        <form onSubmit={handleSave}>
          <div className="formGroup">
            <div className="mt-3">
              <TextField
                select
                label="User"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
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
            <div className="mt-3">
              <TextField
                label="Description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                multiline
                rows={4}
                className="textField"
              />
            </div>
            <div className="mt-3">
              <TextField
                label="Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                fullWidth
                className="textField"
              />
            </div>
            <div className="mt-3">
              <TextField
                label="Start Time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                fullWidth
                className="textField"
              />
            </div>
            <div className="mt-3">
              <TextField
                label="End Time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                fullWidth
                className="textField"
              />
            </div>
          </div>
          <DialogActions>
            <MdOutlineCancelPresentation
              onClick={onClose}
              className="icon-button-danger">
              Cancel
            </MdOutlineCancelPresentation>
            <BsCloudUpload type="submit" onClick={handleSave}  className="icon-button">
              Save
            </BsCloudUpload>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditActivity;