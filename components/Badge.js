export default function Badge({ children, color = 'blue' }) {
  const colors = {
    blue: 'bg-blue-600 text-white',
    green: 'bg-green-600 text-white',
    yellow: 'bg-yellow-500 text-gray-900',
    red: 'bg-red-600 text-white',
    gray: 'bg-gray-600 text-white',
  };
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${colors[color]}`}>{children}</span>
  );
}
