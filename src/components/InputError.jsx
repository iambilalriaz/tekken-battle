const InputError = ({ errorMessage = null }) => {
  return (
    errorMessage && (
      <p className='text-error font-medium text-sm mt-1'>{errorMessage}</p>
    )
  );
};

export default InputError;
