export default function Button({ children, variant = 'primary', ...props }) {
  const base = 'px-4 py-2 rounded font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-500';
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-700 hover:bg-gray-600 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };
  return (
    <button className={`${base} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
}
