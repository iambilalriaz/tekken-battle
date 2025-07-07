import { useForm } from 'react-hook-form';
import GlassyModal from '@/components/common/GlassyModal';
import ImageUploadInput from '@/components/ImageUploadInput';
import InputError from '@/components/common/InputError';
import Button from '@/components/common/Button';
import toast from 'react-hot-toast';
import { useNetworkRequest } from '@/hooks/useNetworkRequest';
import { updateLoggedInUserAPI } from '@/lib/api';
import { useCustomerProfile } from '@/store/useCustomerProfile';
import Loader from '@/components/common/Loader';
import { useUploadImage } from '@/hooks/useUploadImage';
import { useEffect } from 'react';
import { MAX_FILE_SIZE } from '@/constants';

const UpdatePictureModal = ({ getLoggedInUser }) => {
  const {
    register,
    handleSubmit,
    watch,
    resetField,
    reset,
    formState: { errors },
  } = useForm();

  const { updateProfileModal, toggleUpdateProfileModal } = useCustomerProfile();
  const watchedFile = watch('profileImage')?.['0'];

  const removeSelectedFile = () => {
    resetField('profileImage');
  };

  const { onUploadImage, uploadingFile, fileUploadError } = useUploadImage({
    watchedFile,
  });
  const {
    loading: updatingUser,
    errorMessage: updateUserError,
    executeFunction: updateLoggedInUser,
  } = useNetworkRequest({
    apiFunction: updateLoggedInUserAPI,
  });

  useEffect(() => {
    if (fileUploadError || updateUserError) {
      toast.error(fileUploadError || updateUserError);
    }
  }, [fileUploadError, updateUserError]);
  const onUpdateProfilePicture = async () => {
    try {
      const profileImageUrl = await onUploadImage();
      if (profileImageUrl) {
        await updateLoggedInUser({ profileImageUrl });
        toggleUpdateProfileModal();
        reset();
        await getLoggedInUser();
      }
    } catch (error) {}
  };

  return (
    <GlassyModal
      title='Update Profile Image'
      isOpen={updateProfileModal}
      onClose={toggleUpdateProfileModal}
    >
      <ImageUploadInput
        name='profileImage'
        label=''
        classes='mt-3'
        {...register('profileImage', {
          required: 'Profile picture is required',
        })}
        watchedFile={watchedFile}
        removeSelectedFile={removeSelectedFile}
      />
      <InputError errorMessage={errors?.profileImage?.message} />
      <InputError
        errorMessage={
          watchedFile?.size > MAX_FILE_SIZE
            ? 'File size must be under 5MB.'
            : ''
        }
      />
      {uploadingFile || updatingUser ? (
        <div className='mt-8'>
          <Loader />
        </div>
      ) : (
        <Button
          className='mt-8 mx-auto w-full md:w-1/2 flex justify-center'
          onClick={handleSubmit(onUpdateProfilePicture)}
        >
          Update
        </Button>
      )}
    </GlassyModal>
  );
};

export default UpdatePictureModal;
