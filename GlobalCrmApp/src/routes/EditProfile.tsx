import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { getUserById } from '../services/auth-service';
import { uploadImage } from '../utils/azureBlobServices';
import Cropper from 'react-easy-crop';
import 'react-easy-crop/react-easy-crop.css';
import '../css/editprofile.scss';
import { usersService } from '../services/usersService';
import { DarkModeContext } from '../contexts/DarkModeContext'; // Assuming you have a DarkModeContext

const validationSchema = Yup.object({
  firstName: Yup.string().required('First Name is required').min(2, 'First Name must be at least 2 characters').max(40, 'First Name must be at most 40 characters'),
  lastName: Yup.string().required('Last Name is required').min(2, 'Last Name must be at least 2 characters').max(40, 'Last Name must be at most 40 characters'),
  phoneNumber: Yup.string().required('Phone Number is required'),
});

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const EditProfile = () => {
  const { darkMode } = useContext(DarkModeContext); // Use context to get dark mode state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [role, setRole] = useState('');
  const [profileAlt, setProfileAlt] = useState('');
  const [profileSrc, setProfileSrc] = useState('');
  const [croppedImage, setCroppedImage] = useState('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem('UserId');
      if (userId) {
        try {
          const userDetails = await getUserById(userId);
          setFirstName(userDetails.firstName);
          setLastName(userDetails.lastName);
          setEmail(userDetails.email);
          setPhoneNumber(userDetails.phoneNumber);
          setJobTitle(userDetails.jobTitle);
          setRole(userDetails.roles[0]);
          setProfileAlt(userDetails.profileImage.alt);
          setProfileSrc(userDetails.profileImage.src);
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    };

    fetchUserDetails();
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    const userId = localStorage.getItem('UserId');
    try {
      let newProfileSrc = profileSrc;
      let newProfileAlt = profileAlt;
      if (croppedImage) {
        try {
          const file = await fetch(croppedImage)
            .then((r) => r.blob())
            .then((blob) => new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' }));

          const uploadedUrl = await uploadImage(file);
          newProfileSrc = uploadedUrl;
          newProfileAlt = 'Profile Image'; // Set a new alt text for the profile image
          setProfileSrc(newProfileSrc);
          setProfileAlt(newProfileAlt);
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      }
      const userDetails = {
        firstName: capitalizeFirstLetter(values.firstName),
        lastName: capitalizeFirstLetter(values.lastName),
        email,
        phoneNumber: values.phoneNumber,
        jobTitle,
        role,
        profileImage: {
          alt: newProfileAlt,
          src: newProfileSrc,
        },
      };
      console.log('Updating user details:', userDetails); // Debug log
      await usersService.updateUserDetails(userId, userDetails);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, setFieldValue) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileSrc(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const maxSize = Math.max(image.width, image.height);
    const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

    canvas.width = safeArea;
    canvas.height = safeArea;

    ctx!.drawImage(
      image,
      safeArea / 2 - image.width * 0.5,
      safeArea / 2 - image.height * 0.5
    );

    const data = ctx!.getImageData(0, 0, safeArea, safeArea);

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx!.putImageData(
      data,
      -safeArea / 2 + image.width * 0.5 - pixelCrop.x,
      -safeArea / 2 + image.height * 0.5 - pixelCrop.y
    );

    return new Promise<string>((resolve, reject) => {
      canvas.toBlob((file) => {
        if (file) {
          const fileUrl = URL.createObjectURL(file);
          resolve(fileUrl);
        } else {
          reject(new Error('Canvas is empty'));
        }
      }, 'image/jpeg');
    });
  };

  const handleCropUpload = async () => {
    if (profileSrc && croppedAreaPixels) {
      const croppedImageUrl = await getCroppedImg(profileSrc, croppedAreaPixels);
      setCroppedImage(croppedImageUrl);
      setShowCropper(false);
    }
  };

  return (
    <div className={`edit-profile-container ${darkMode ? 'dark-mode' : ''}`}>
      <div className={`edit-profile-header ${darkMode ? 'dark-mode' : ''}`}>
        <h2 className="text-2xl font-bold mb-4">Edit My Profile</h2>
        <p className="text-lg mb-2">Email: {email}</p>
        <p className="text-lg mb-4">Role: {role}</p>
      </div>
      {showAlert && <div className="alert alert-success">Profile updated successfully!</div>}
      <Formik
        initialValues={{ firstName, lastName, phoneNumber }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form className="edit-profile-form">
            <div className="profile-image-container">
              {!showCropper && <img src={croppedImage || profileSrc} alt={profileAlt} className="profile-image" />}
              <label className="block mb-2">Replace Profile Image:</label>
              <input type="file" onChange={(e) => handleImageUpload(e, setFieldValue)} className="file-input mb-4" />
              {showCropper && profileSrc && (
                <div className="crop-container">
                  <Cropper
                    image={profileSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape="round"
                    showGrid={false}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                  <button type="button" onClick={handleCropUpload} className="crop-button">Crop Image</button>
                </div>
              )}
            </div>
            <div className="form-group">
              <label>First Name:</label>
              <Field type="text" name="firstName" />
              <ErrorMessage name="firstName" component="div" className="error-message" />
            </div>
            <div className="form-group">
              <label>Last Name:</label>
              <Field type="text" name="lastName" />
              <ErrorMessage name="lastName" component="div" className="error-message" />
            </div>
            <div className="form-group">
              <label>Phone Number:</label>
              <Field type="text" name="phoneNumber" />
              <ErrorMessage name="phoneNumber" component="div" className="error-message" />
            </div>
            <div className="form-group">
              <label>Job Title:</label>
              <Field type="text" name="jobTitle" value={jobTitle} disabled />
            </div>
            <button type="submit" className="submit-button" disabled={isSubmitting}>Update Profile</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

const createImage = (url) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

export default EditProfile;