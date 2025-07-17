import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrashIcon } from '@heroicons/react/24/solid';

export default function FilePreviewList({ files = [], onRemove }) {
  if (!files.length) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      <AnimatePresence>
        {files.map((file, idx) => (
          <motion.div
            key={file.name + file.size}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="bg-gradient-to-br from-[#232347] to-[#181818] text-white px-3 py-1 rounded-xl text-xs flex items-center gap-2 shadow-md border border-gray-800 backdrop-blur-lg"
          >
            <span className="truncate max-w-[120px] font-mono text-primary">{file.name}</span>
            <span className="text-gray-400">({Math.round(file.size/1024)} Ko)</span>
            {onRemove && (
              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                className="ml-1 text-red-400 hover:text-red-600 transition-all rounded focus:outline-none"
                onClick={() => onRemove(idx)}
                aria-label="Retirer le fichier"
              >
                <TrashIcon className="w-4 h-4" />
              </motion.button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
