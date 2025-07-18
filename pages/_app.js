import '../styles/globals.css'
import { AuthProvider } from '../components/AuthProvider';
import { ToastProvider } from '../components/ToastContainer';
import { MailProvider } from '../components/MailContext';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js');
      });
    }
  }, []);
  return (
    <AuthProvider>
      <ToastProvider>
        <MailProvider>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={router.route}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              <Component {...pageProps} />
            </motion.div>
          </AnimatePresence>
        </MailProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
