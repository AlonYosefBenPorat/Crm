import React, { useState } from 'react';
import { uploadImage } from '../utils/azureBlobServices';

const TestComponent: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const url = await uploadImage(file);
      setImageUrl(url);
      localStorage.setItem('uploadedImageUrl', url);
    }
  };

  return (
    <div className='mt-16'>
      <input type="file" onChange={handleFileChange} />
      {imageUrl && <img src={imageUrl} alt="Uploaded" />}
    </div>
  );
};

export default TestComponent;