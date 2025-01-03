import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import '../../css/sidewindow.scss'; 
import { IoClose } from 'react-icons/io5';
import { showErrorDialog, showSuccessDialog } from '../../dialogs/dialogs';
import Spinner from '../../components/Spinner';
import { customerService } from '../../services/customerSerivce';
import { uploadImage } from '../../utils/azureBlobServices';

interface AddCustomerProps  {
  onClose: () => void;
  refreshTable: () => Promise<void>;
}

const AddCustomer: React.FC<AddCustomerProps> = ({ onClose, refreshTable }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    country: Yup.string().required('Country is required'),
    city: Yup.string().required('City is required'),
    address: Yup.string().required('Address is required'),
    phone: Yup.string().required('Phone number is required'),
    contactPerson: Yup.string().required('Contact person is required'),
    domain: Yup.string().required('Domain is required'),
    bnNumber: Yup.string().required('BN Number is required'),
    isActive: Yup.boolean().required('Status is required'),
    logoAlt: Yup.string().required('Logo Alt is required'),
    logoSrc: Yup.string().required('Logo Src is required'),
  });

  const initialValues = {
    name: '',
    country: '',
    city: '',
    address: '',
    phone: '',
    contactPerson: '',
    domain: '',
    bnNumber: '',
    isActive: true,
    logoAlt: '',
    logoSrc: '',
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setIsLoading(true);
    setError(null);
    try {
      const customerData = {
        ...values,
        logo: {
          alt: values.logoAlt,
          src: values.logoSrc,
        },
      };
      

      await customerService.createCustomer(customerData);
      console.log('Customer added successfully');
      resetForm();
      showSuccessDialog('Customer added successfully.');
      await refreshTable();
      onClose();
    } catch (err) {
      showErrorDialog('An error occurred while adding the customer.');
      setError('An error occurred while adding the customer.');
      console.error('An error occurred while adding the customer:', err);
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

      // Check file type (allow only JPG, PNG, GIF, BMP, WEBP)
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Only JPG, PNG, GIF, BMP, and WEBP files are allowed');
        return;
      }

      setIsUploading(true);
      try {
        const url = await uploadImage(file);
        setFieldValue('logoSrc', url);
        setFieldValue('logoAlt', file.name);
      } catch (error) {
        alert('Failed to upload image. Please try again.');
        console.error('Error uploading image:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="side-panel">
      <div className="side-panel-header">
        <h2>Add Customer</h2>
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
                <label htmlFor="name">Name</label>
                <Field type="text" name="name" />
                <ErrorMessage name="name" component="div" className="error-message" />
              </div>
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <Field type="text" name="country" />
                <ErrorMessage name="country" component="div" className="error-message" />
              </div>
              <div className="form-group">
                <label htmlFor="city">City</label>
                <Field type="text" name="city" />
                <ErrorMessage name="city" component="div" className="error-message" />
              </div>
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <Field type="text" name="address" />
                <ErrorMessage name="address" component="div" className="error-message" />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <Field type="text" name="phone" />
                <ErrorMessage name="phone" component="div" className="error-message" />
              </div>
              <div className="form-group">
                <label htmlFor="contactPerson">Contact Person</label>
                <Field type="text" name="contactPerson" />
                <ErrorMessage name="contactPerson" component="div" className="error-message" />
              </div>
              <div className="form-group">
                <label htmlFor="domain">Domain</label>
                <Field type="text" name="domain" />
                <ErrorMessage name="domain" component="div" className="error-message" />
              </div>
              <div className="form-group">
                <label htmlFor="bnNumber">BN Number</label>
                <Field type="text" name="bnNumber" />
                <ErrorMessage name="bnNumber" component="div" className="error-message" />
              </div>
              <div className="form-group">
                <label htmlFor="logoUpload">Upload Logo</label>
                <input type="file" name="logoUpload" onChange={(event) => handleFileChange(event, setFieldValue)} />
                {isUploading && <Spinner />}
                <ErrorMessage name="logoSrc" component="div" className="error-message" />
              </div>
              {values.logoSrc && <img src={values.logoSrc} alt={values.logoAlt} className="logo-preview" />}
              {error && <div className="error-message">{error}</div>}
              <div className="form-group">
                <button type="submit" disabled={isSubmitting || isLoading || isUploading}>
                  {isLoading ? <Spinner /> : 'Add Customer'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddCustomer;