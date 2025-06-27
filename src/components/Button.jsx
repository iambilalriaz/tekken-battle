const Button = (props) => {
  return (
    <button
      {...props}
      className={`bg-secondary text-primary font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-200 cursor-pointer ${props.className}`}
    >
      {props.children}
    </button>
  );
};
export default Button;
