const VARIANTS = {
  primary: 'border-primary text-primary hover:bg-primary hover:text-white',
  secondary:
    'border-secondary text-secondary hover:bg-secondary hover:text-primary',
  success: 'border-success text-success hover:bg-success hover:text-white',
  danger: 'border-error text-error hover:bg-error hover:text-white',
  'dodger-blue':
    'border-dodger-blue text-dodger-blue hover:bg-dodger-blue hover:text-white',
};
const OutlineButton = (props) => {
  const { variant = 'secondary' } = props;
  const styles = VARIANTS[variant];

  return (
    <button
      {...props}
      className={`border-2 uppercase font-semibold px-4 py-2 text-sm rounded-lg shadow-md transition-all duration-200 cursor-pointer ${styles} ${props.className}`}
    >
      {props.children}
    </button>
  );
};
export default OutlineButton;
