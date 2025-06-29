const VARIANTS = {
  primary: 'bg-primary border-2 border-primary text-sm text-white',
  secondary: 'bg-secondary border-2 border-secondary text-sm text-primary',
  success: 'bg-success border-2 border-success text-sm text-white',
  danger: 'bg-error border-2 border-error text-sm text-white',
  'dodger-blue':
    'bg-dodger-blue border-2 border-dodger-blue text-sm text-white',
};
const Button = (props) => {
  const { variant = 'secondary' } = props;
  const styles = VARIANTS[variant];
  return (
    <button
      {...props}
      className={`${styles} font-semibold px-4 py-2 rounded-lg shadow-md transition-all duration-200 cursor-pointer ${props.className}`}
    >
      {props.children}
    </button>
  );
};
export default Button;
