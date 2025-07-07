import toast from 'react-hot-toast';
import { uploadProfileImage } from '@/lib/api';
import { useNetworkRequest } from './useNetworkRequest';
import { MAX_FILE_SIZE } from '@/constants';

export const useUploadImage = ({ watchedFile }) => {
  const {
    loading: uploadingFile,
    errorMessage: fileUploadError,
    executeFunction: uploadImage,
  } = useNetworkRequest({
    apiFunction: uploadProfileImage,
  });

  const onUploadImage = async () => {
    if (!watchedFile) {
      toast.error('Profile picture is required.');
      return null;
    }

    if (watchedFile?.size > MAX_FILE_SIZE) {
      toast.error('File size must be under 5MB.');
      return null;
    }

    const formData = new FormData();
    formData.append('file', watchedFile);

    try {
      const { url } = await uploadImage(formData);

      if (!url) {
        toast.error('Failed to upload image');
        return null;
      }

      return url;
    } catch (err) {
      toast.error('Image upload error');
      return null;
    }
  };

  return { onUploadImage, uploadingFile, fileUploadError };
};
