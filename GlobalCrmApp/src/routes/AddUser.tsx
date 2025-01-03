import React, { useState, useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { IoClose } from 'react-icons/io5';
import { DarkModeContext } from '../contexts/DarkModeContext';
import { usersService } from '../services/usersService'; // Import the usersService
import { showErrorDialog, showSuccessDialog } from '../dialogs/dialogs';
import Spinner from '../components/Spinner';
import '../css/form.scss';
import { uploadImage } from '../utils/azureBlobServices';

interface AddUserProps {
  onClose: () => void;
  refreshTable: () => Promise<void>;
}

const AddUser: React.FC<AddUserProps> = ({ onClose, refreshTable }) => {
  const { darkMode } = useContext(DarkModeContext) ?? { darkMode: false };
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email field is Required'),
    firstName: Yup.string().required('First Name field is Required'),
    lastName: Yup.string().required('Last Name field is Required'),
    password: Yup.string()
      .required('Password field is Required')
      .min(6, 'Password must be at least 6 characters')
      .max(20, 'Password must be at most 20 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character'
      ),
    dateOfBirth: Yup.date().required('Date of Birth field is Required'),
    jobTitle: Yup.string().required('Job Title field is Required'),
    phoneNumber: Yup.string().required('Phone Number field is Required'),
    role: Yup.string().required('Role field is Required'),
  });

  const initialValues = {
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    dateOfBirth: '',
    jobTitle: '',
    phoneNumber: '',
    role: '',
    profileAlt: '',
    profileSrc: '',
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setIsLoading(true);
    setError(null);
    try {
      await usersService.addUser(values);
      console.log('User added successfully');
      resetForm();
      await refreshTable(); 
      onClose();
      showSuccessDialog('User added successfully.');
    } catch (err) {
      showErrorDialog('An error occurred while adding the user.');
      setError('An error occurred while adding the user.');
      console.error('An error occurred while adding the user:', err);
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  const handleFileChange = async (event, setFieldValue) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      // Check file size (limit to 30 MB)
      if (file.size > 30 * 1024 * 1024) {
        alert('File size exceeds 30 MB');
        return;
      }

      // Check file type (allow only JPG, PNG)
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Only JPG, PNG, GIF, BMP, and WEBP files are allowed');
        return;
      }

      setIsUploading(true);
      try {
        const url = await uploadImage(file);
        setFieldValue('profileSrc', url);
        setFieldValue('profileAlt', file.name);
      } catch (error) {
        alert('Failed to upload image. Please try again.');
        console.error('Error uploading image:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className={`side-panel ${darkMode ? 'darkmode' : ''}`}>
      <div className="side-panel-header">
        <h2>Add User</h2>
        <button onClick={onClose} className="close-button"><IoClose/></button>
      </div>
      <div className="side-panel-content">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <Field type="email" name="email" />
                <ErrorMessage name="email" component="div" className="error-message" />
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
                <label htmlFor="password">Password</label>
                <Field type="password" name="password" />
                <ErrorMessage name="password" component="div" className="error-message" />
              </div>
              <div className="form-group">
                <label htmlFor="dateOfBirth">Date of Birth</label>
                <Field type="date" name="dateOfBirth" />
                <ErrorMessage name="dateOfBirth" component="div" className="error-message" />
              </div>
              <div className="form-group">
                <label htmlFor="jobTitle">Job Title</label>
                <Field as="select" name="jobTitle">
                  <option value="">Select Job Title</option>
                  <option value="Developer">Developer</option>
                  <option value="Manager">Manager</option>
                  <option value="Designer">Designer</option>
                </Field>
                <ErrorMessage name="jobTitle" component="div" className="error-message" />
              </div>
              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <Field type="text" name="phoneNumber" />
                <ErrorMessage name="phoneNumber" component="div" className="error-message" />
              </div>
              <div className="form-group">
                <label htmlFor="role">Role</label>
                <Field as="select" name="role">
                  <option value="">Select Role</option>
                  <option value="Viewer">Viewer</option>
                  <option value="GlobalAdmin">GlobalAdmin</option>
                  <option value="RedearAdmin">RedearAdmin</option>
                  <option value="ServiceAdmin">ServiceAdmin</option>
                </Field>
                <ErrorMessage name="role" component="div" className="error-message" />
              </div>
              <div className="form-group">
                <label htmlFor="profileUpload">Upload Profile Picture</label>
                <input type="file" name="profileUpload" onChange={(event) => handleFileChange(event, setFieldValue)} />
                {isUploading && <Spinner />}
                <ErrorMessage name="profileSrc" component="div" className="error-message" />
              </div>
              {values.profileSrc && <img src={values.profileSrc} alt={values.profileAlt} className="profile-preview" />}
              {error && <div className="error-message">{error}</div>}
              <div className="form-group">
                <button type="submit" disabled={isSubmitting || isLoading || isUploading}>
                  {isLoading ? <Spinner /> : 'Add User'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddUser;