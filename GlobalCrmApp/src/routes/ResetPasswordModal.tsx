import React, { useState, useEffect, useContext } from 'react';
import '../css/resetPasswordModal.scss';
import { getTokenResetPassword, resetPassword } from '../services/auth-service';
import * as yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { DarkModeContext } from '../contexts/DarkModeContext';
import { showErrorDialog, showSuccessDialog } from '../dialogs/dialogs';

const ResetPasswordModal = ({ isOpen, closeModal }) => {
  const { darkMode } = useContext(DarkModeContext);
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem('UserEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setOldPassword('');
    }
  }, [isOpen]);

  const validationSchema = yup.object().shape({
    newPassword: yup
      .string()
      .min(8, 'Password must be at least 8 characters')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(/[@$!%*?&#]/, 'Password must contain at least one special character')
      .required('New Password is required'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    const { newPassword, confirmPassword } = values;

    if (newPassword !== confirmPassword) {
      setSubmitting(false);
      return;
    }

    if (!email) {
      setSubmitting(false);
      return;
    }

    try {
      await getTokenResetPassword(email, oldPassword);
      const token = localStorage.getItem('resetToken');
      if (!token) {
        setSubmitting(false);
        showErrorDialog('Failed to get reset token');
        return;
      }

      await resetPassword(email, newPassword);
      localStorage.removeItem('resetToken');
      closeModal();
      showSuccessDialog('Password reset successfully!');
    } catch (error) {
      showErrorDialog('Error resetting password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className={`modal-container ${darkMode ? 'dark-mode' : ''}`}>
          <div className="modal-overlay" onClick={closeModal}></div>
          <div className="modal-content">
            <h2 className="modal-header">Reset Password</h2>
            <Formik
              initialValues={{ newPassword: '', confirmPassword: '' }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="modal-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Old Password</label>
                    <input
                      type="password"
                      className="modal-input"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <div className="relative">
                      <Field
                        type={showNewPassword ? 'text' : 'password'}
                        name="newPassword"
                        className="modal-input"
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    <ErrorMessage name="newPassword" component="div" className="error-message" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm Password</label>
                    <div className="relative">
                      <Field
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        className="modal-input"
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    <ErrorMessage name="confirmPassword" component="div" className="error-message" />
                  </div>
                  <div className="form-actions">
                    <button type="button" onClick={closeModal} className="modal-button-cancel">
                      Cancel
                    </button>
                    <button type="submit" className="modal-button" disabled={isSubmitting}>
                      Submit
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </>
  );
};

export default ResetPasswordModal;