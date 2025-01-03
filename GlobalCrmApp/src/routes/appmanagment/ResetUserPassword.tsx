import React, { useState, useEffect } from 'react';
import { usersService } from '../../services/usersService';
import { showErrorDialog, showSuccessDialog } from '../../dialogs/dialogs';
import { IoClose, IoEye, IoEyeOff } from 'react-icons/io5';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Spinner from '../../components/Spinner';
import '../../css/sidewindow.scss'; 

import { sendEmail } from '../../services/smtp-Service';
import { generatePassword } from '../../services/Auto-Service';

interface ResetUserPasswordProps {
  onClose: () => void;
  userId: string;
  refreshTable: () => Promise<void>;
}

const ResetUserPassword: React.FC<ResetUserPasswordProps> = ({ onClose, userId, refreshTable }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const userEmail = localStorage.getItem('selectedUserEmail');

  const initialValues = {
    newPassword: '',
  };

  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .required('Password field is Required')
      .min(6, 'Password must be at least 6 characters')
      .max(20, 'Password must be at most 20 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character'
      ),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setIsLoading(true);
    setError(null);
    try {
      await usersService.resetUserPassword(userId, values.newPassword);
      console.log('Password reset successfully');
      await sendEmail({
        toEmail: userEmail,
        subject: 'Your New Password',
        message: `Your new password is: ${values.newPassword}`
      });
      showSuccessDialog(`Password reset successfully and sent to ${userEmail}`);
      resetForm();
      refreshTable();
      await refreshTable();
      onClose();
    } catch (err) {
      showErrorDialog('An error occurred while resetting the password.');
      setError('An error occurred while resetting the password.');
      console.error('An error occurred while resetting the password:', err);
    } finally {
      setIsLoading(false);
      setSubmitting(false);
      refreshTable();
    }
  };

  const handleGeneratePassword = (setFieldValue) => {
    const newPassword = generatePassword();
    setFieldValue('newPassword', newPassword);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="side-panel">
      <div className="side-panel-header">
        <h2>Reset Password:</h2>
        <p>{userEmail}</p>
        <button onClick={onClose} className="close-button"><IoClose /></button>
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
                <label htmlFor="newPassword">New Password</label>
                <div className="password-field">
                  <Field type={showPassword ? "text" : "password"} name="newPassword" className="password-input" />
                  <span onClick={toggleShowPassword} className="eye-icon">
                    {showPassword ? <IoEyeOff /> : <IoEye />}
                  </span>
                </div>
                <ErrorMessage name="newPassword" component="div" className="error-message" />
                <button type="button" onClick={() => handleGeneratePassword(setFieldValue)} className="generate-password-button">
                  Generate Password
                </button>
              </div>
              {error && <div className="error-message">{error}</div>}
              <div className="form-group">
                <button type="submit" disabled={isSubmitting || isLoading}>
                  {isLoading ? <Spinner /> : 'Reset Password and Send Email'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ResetUserPassword;