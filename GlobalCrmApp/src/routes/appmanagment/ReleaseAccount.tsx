import React, { useEffect, useState } from 'react';
import { releaseLockedOutUsers, unlockUser } from '../../services/releaseaccount';
import { formatDate, formatLocalTime } from '../../helperFunction/formatDate';
import '../../css/table.scss';
import { AiTwotoneUnlock } from 'react-icons/ai';
import { showSuccessDialog } from '../../dialogs/dialogs';
import Spinner from '../../components/Spinner';

const ReleaseAccount = () => {
  const [lockedOutUsers, setLockedOutUsers] = useState([]);

  useEffect(() => {
    const fetchLockedOutUsers = async () => {
      try {
        const users = await releaseLockedOutUsers();
        setLockedOutUsers(users);
      } catch (error) {
        console.error('Error fetching locked-out users:', error);
      }
    };

    fetchLockedOutUsers();
  }, []);

  const calculateRemainingTime = (endTime: string) => {
    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    const difference = end - now;

    if (difference <= 0) {
      return '00:00:00';
    }

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLockedOutUsers((users) =>
        users.map((user) => ({
          ...user,
          remainingTime: calculateRemainingTime(user.lockoutEnd),
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [lockedOutUsers]);

  const handleUnlockUser = async (userId: string) => {
    Spinner('loading');
    try {
      await unlockUser(userId);
      setLockedOutUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      
      showSuccessDialog('User unlocked successfully');
    } catch (error) {
      console.error('Error unlocking user:', error);
      showSuccessDialog('Error unlocking user');
    }
  };

  return (
    <div className='mt-16'>
         <div className="h1-container">
        <h1>Locked Out Users</h1>
        <span className="badge">managment</span>
      </div>
      <table className='table'>
        <thead>
          <tr>
            <th>User Name</th>
            <th>Lockout End Date</th>
            <th>Lockout End Time</th>
            <th>Remaining Lockout Time</th>
            <th>Access Failed Count</th>
            <th>Release Now</th>
          </tr>
        </thead>
        <tbody>
          {lockedOutUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.userName}</td>
              <td>{formatDate(user.lockoutEnd)}</td>
              <td>{formatLocalTime(user.lockoutEnd)}</td>
              <td>{user.remainingTime || calculateRemainingTime(user.lockoutEnd)}</td>
              <td>{user.accessFailedCount}</td>
              <td>
                <AiTwotoneUnlock title='Unlock User' aria-label='Unlock User' className='icon-button' onClick={() => handleUnlockUser(user.id)} style={{ cursor: 'pointer' }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReleaseAccount;