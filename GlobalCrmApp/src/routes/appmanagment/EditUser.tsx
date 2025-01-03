import React, { useState, useEffect, useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import '../../css/extendSideWindow.scss'; // Import the SCSS file for styling
import { IoClose } from 'react-icons/io5';
import { FiKey, FiTrash } from 'react-icons/fi';
import { DarkModeContext } from '../../contexts/DarkModeContext';
import { usersService } from '../../services/usersService';
import { showErrorDialog, showSuccessDialog, showDeleteConfirmation } from '../../dialogs/dialogs';
import Spinner from '../../components/Spinner';
import ResetUserPassword from './ResetUserPassword';

interface EditUserProps {
  onClose: () => void;
  userId: string;
  refreshTable: () => Promise<void>;
}

const EditUser: React.FC<EditUserProps> = ({ onClose, userId, refreshTable }) => {
  const { darkMode } = useContext(DarkModeContext) ?? { darkMode: false };
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState({
    email: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    jobTitle: '',
    phoneNumber: '',
    role: '',
    profileAlt: '',
    profileSrc: '',
    createdAt: '',
    updatedAt: '',
    lastPasswordUpdated: '',
    isEnabled: false,
  });
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset() * 60000; // Get the timezone offset in milliseconds
    const localDate = new Date(date.getTime() - offset); // Adjust the date by the offset
    return localDate.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const userData = await usersService.getUserById(userId);
        setInitialValues({
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          dateOfBirth: userData.dateOfBirth.split('T')[0], 
          jobTitle: userData.jobTitle,
          phoneNumber: userData.phoneNumber,
          role: userData.roles[0],
          profileAlt: userData.profileImage.alt,
          profileSrc: userData.profileImage.src,
          createdAt: formatDate(userData.createdAt),
          updatedAt: formatDate(userData.updatedAt),
          lastPasswordUpdated: formatDate(userData.lastPasswordUpdated),
          isEnabled: userData.isEnabled,
        });
        localStorage.setItem('selectedUserId', userId);
        localStorage.setItem('selectedUserEmail', userData.email);
      } catch (err) {
        showErrorDialog('An error occurred while fetching the user data.');
        setError('An error occurred while fetching the user data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const validationSchema = Yup.object({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    jobTitle: Yup.string().required('Job Title is required'),
    phoneNumber: Yup.string().required('Phone Number is required'),
    role: Yup.string().required('Role is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsLoading(true);
    setError(null);
    try {
      const userDetails = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        dateOfBirth: values.dateOfBirth,
        jobTitle: values.jobTitle,
        phoneNumber: values.phoneNumber,
        role: values.role,
        isEnabled: values.isEnabled, 
        profileAlt: values.profileAlt,
        profileSrc: values.profileSrc,
      };

      console.log('Updating user with details:', userDetails); // Log the userDetails object

      await usersService.updateUserDetails(userId, userDetails);
      onClose();
      showSuccessDialog('User updated successfully.');
      await refreshTable();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        const validationErrors = err.response.data.errors;
        console.error('Validation errors:', validationErrors);
        console.log('Validation errors:', validationErrors);
        const errorMessages = Object.values(validationErrors).flat().join(' ');
        setError(`Validation errors occurred: ${errorMessages}`);
      } else {
        showErrorDialog('An error occurred while updating the user.');
        setError('An error occurred while updating the user.');
        console.error('An error occurred while updating the user:', err);
        console.log('An error occurred while updating the user:', err);
      }
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    const confirmed = await showDeleteConfirmation();
    if (!confirmed) return;

    setIsLoading(true);
    setError(null);
    try {
      await usersService.deleteUser(userId);
      showSuccessDialog('User deleted successfully.');
      onClose();
      await refreshTable();
    } catch (err) {
      showErrorDialog('An error occurred while deleting the user.');
      setError('An error occurred while deleting the user.');
      console.error('An error occurred while deleting the user:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleResetPassword = () => {
    setIsResetPasswordOpen(!isResetPasswordOpen);
  };

  return (
    <div className={`side-panel ${darkMode ? 'darkmode' : ''}`}>
      <div className="side-panel-header">
       

        <button onClick={onClose} className="close-button"><IoClose /></button>
      </div>
      <div className="side-panel-content">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form>
              <div className="form-group align-center">
                <img src={values.profileSrc} alt={values.profileAlt} className="profile-image" />
                <ErrorMessage name="profileSrc" component="div" className="error-message" />
              </div>
              <div className="toolbar-container">
                <h2 className='text-center' >Edit Details to {`${values.email}`}</h2>
          <ul className="toolbar-list">
      <li>
        <button className="icon-button" title="Reset Password" onClick={toggleResetPassword}>
          <FiKey />
        </button>
      </li>
      <li>
        <button className="icon-button" title="Delete User" onClick={handleDeleteUser}>
          <FiTrash />
        </button>
      </li>
    </ul>
        </div>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <Field type="email" name="email" disabled />
                </div>
                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <Field type="text" name="fullName" value={`${values.firstName} ${values.lastName}`} disabled />
                </div>
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <Field type="text" name="firstName" />
                  <ErrorMessage name="firstName" component="div" className="error-message" />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <Field type="text" name="lastName" />
                  <ErrorMessage name="lastName" component="div" className="error-message" />
                </div>
                <div className="form-group">
                  <label htmlFor="dateOfBirth">Date of Birth</label>
                  <Field type="date" name="dateOfBirth" value={values.dateOfBirth} disabled />
                  <ErrorMessage name="dateOfBirth" component="div" className="error-message" />
                </div>
                <div className="form-group">
                  <label htmlFor="jobTitle">Job Title</label>
                  <Field type="text" name="jobTitle" />
                  <ErrorMessage name="jobTitle" component="div" className="error-message" />
                </div>
                <div className="form-group">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <Field type="text" name="phoneNumber" />
                  <ErrorMessage name="phoneNumber" component="div" className="error-message" />
                </div>
                <div className="form-group">
                  <label htmlFor="role">Role</label>
                  <Field as="select" name="role" value={values.role}>
                    <option value="">Select Role</option>
                    <option value="Viewer">Viewer</option>
                    <option value="GlobalAdmin">GlobalAdmin</option>
                    <option value="RedearAdmin">RedearAdmin</option>
                    <option value="ServiceAdmin">ServiceAdmin</option>
                  </Field>
                  <ErrorMessage name="role" component="div" className="error-message" />
                </div>
                <div className="form-group">
                  <label htmlFor="createdAt">Created At</label>
                  <Field type="text" name="createdAt" value={values.createdAt} disabled />
                </div>
                <div className="form-group">
                  <label htmlFor="updatedAt">Last Update</label>
                  <Field type="text" name="updatedAt" value={values.updatedAt} disabled />
                </div>
                <div className="form-group">
                  <label htmlFor="lastPasswordUpdated">Last Password Restore</label>
                  <Field type="text" name="lastPasswordUpdated" value={values.lastPasswordUpdated} disabled />
                </div>
                <div className="form-group">
                  <label htmlFor="isEnabled">Is Enabled</label>
                  <Field as="select" name="isEnabled" value={String(values.isEnabled)} onChange={(e) => setFieldValue('isEnabled', e.target.value === 'true')}>
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                  </Field>
                </div>
                {error && <div className="error-message">{error}</div>}
                <div className="form-group text-center">
                  <button type="submit" disabled={isSubmitting || isLoading}>
                    {isLoading ? <Spinner /> : 'Update User'}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
        {isResetPasswordOpen && (
          <ResetUserPassword onClose={toggleResetPassword} userId={userId} refreshTable={refreshTable} />
        )}
      </div>
    </div>
  );
};

export default EditUser;