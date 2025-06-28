'use client';

import { useEffect, useState } from 'react';
import { MdCancel } from 'react-icons/md';

const ImageUploadInput = (props) => {
  const {
    label = 'Upload Image',
    classes = '',
    watchedFile,
    removeSelectedFile,
  } = props;
  const [preview, setPreview] = useState(null);

  const file = watchedFile instanceof File ? watchedFile : null;

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl); // Cleanup on unmount
    } else {
      setPreview(null);
    }
  }, [file]);

  const onRemoveImage = () => {
    setPreview(null);
    removeSelectedFile();
  };

  return (
    <div className={`w-full ${classes}`}>
      <label className='block mb-2 text-sm font-medium text-white'>
        {label}
      </label>

      {preview ? (
        <div className='flex justify-center'>
          <div className='relative'>
            <img
              src={preview}
              alt='Preview'
              className='object-contain rounded-md max-h-20 md:max-h-24'
              width={100}
            />
            <MdCancel
              className='absolute -top-2 -right-2 text-gray bg-black rounded-full cursor-pointer'
              size={20}
              onClick={onRemoveImage}
            />
          </div>
        </div>
      ) : (
        <div className='relative flex items-center justify-center w-full h-20 border-2 border-dashed border-white rounded-xl cursor-pointer hover:border-secondary transition-colors'>
          <input
            {...props}
            type='file'
            accept='image/*'
            multiple={false}
            className='absolute inset-0 opacity-0 cursor-pointer'
          />

          <span className='text-white text-sm'>Click or drag image here</span>
        </div>
      )}
    </div>
  );
};

export default ImageUploadInput;
