import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { lockUser, getUserLockoutStatus } from '../../services/releaseaccount';
import '../../css/LockUserModal.scss';
import { calculateRemainingTime, formatDateTime } from '../../helperFunction/formatDate';
import { showErrorDialog, showSuccessDialog } from '../../dialogs/dialogs';


Modal.setAppElement('#root');

interface LockUserModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  userId: string;
  refreshTable: () => void;
}

const LockUserModal: React.FC<LockUserModalProps> = ({ isOpen, onRequestClose, userId, refreshTable }) => {
  const [lockoutDuration, setLockoutDuration] = useState(0);
  const [isUserLockedOut, setIsUserLockedOut] = useState(false);
  const [lockoutEnd, setLockoutEnd] = useState('');
  const [remainingTime, setRemainingTime] = useState('');

  useEffect(() => {
    const checkUserLockoutStatus = async () => {
      try {
        const status = await getUserLockoutStatus(userId);
        setIsUserLockedOut(status.isLockedOut);
        setLockoutEnd(status.lockoutEnd);
      } catch (error) {
        console.error('Error checking user lockout status:', error);
      }
    };

    if (isOpen) {
      checkUserLockoutStatus();
    }
  }, [isOpen, userId]);

  useEffect(() => {
    if (isUserLockedOut && lockoutEnd) {
      const interval = setInterval(() => {
        setRemainingTime(calculateRemainingTime(lockoutEnd));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isUserLockedOut, lockoutEnd]);

  const handleLockUser = async () => {
    try {
        await lockUser(userId, lockoutDuration);
        showSuccessDialog(`User locked successfully for ${lockoutDuration} minutes.`);
        onRequestClose();
        refreshTable();
    } catch (error) {
        console.error('Error locking user:', error);
        showErrorDialog('Error locking user. Please try again.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Lock User"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <h2 className="modal-header">Lock User</h2>
      {isUserLockedOut ? (
        <div className="modal-body">
          <p>User is already locked out.</p>
          <p>Lockout end time: {formatDateTime(lockoutEnd)}</p>
          <div className="remaining-time">
            <p>Remaining time: {remainingTime}</p>
          </div>
          <label className="modal-label">
            Increase Lockout Duration (minutes):
            <input
              type="number"
              value={lockoutDuration}
              onChange={(e) => setLockoutDuration(Number(e.target.value))}
              className="modal-input"
            />
          </label>
          <div className="modal-footer">
            <button onClick={handleLockUser} className="modal-button modal-button-primary">
              Increase Lockout
            </button>
            <button onClick={onRequestClose} className="modal-button modal-button-secondary">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="modal-body">
          <label className="modal-label">
            Lockout Duration (minutes):
            <input
              type="number"
              value={lockoutDuration}
              onChange={(e) => setLockoutDuration(Number(e.target.value))}
              className="modal-input"
            />
          </label>
          <div className="modal-footer">
            <button onClick={handleLockUser} className="modal-button modal-button-primary">
              Lock User
            </button>
            <button onClick={onRequestClose} className="modal-button modal-button-secondary">
              Cancel
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default LockUserModal;