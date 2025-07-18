import { motion } from 'framer-motion';

export default function LoadingSpinner({ 
  size = 'md', 
  color = 'primary', 
  text = 'Chargement...',
  showText = true 
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    primary: 'border-primary',
    white: 'border-white',
    gray: 'border-gray-500',
    blue: 'border-blue-500',
    green: 'border-green-500'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <motion.div
        className={`
          ${sizeClasses[size]} 
          border-4 border-t-transparent 
          ${colorClasses[color]} 
          rounded-full
        `}
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 1, 
          repeat: Infinity, 
          ease: 'linear' 
        }}
        aria-label="Chargement en cours"
      />
      {showText && text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-gray-600 font-medium"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}