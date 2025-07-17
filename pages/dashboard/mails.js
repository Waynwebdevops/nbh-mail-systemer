import Layout from '../../components/Layout';
import CourrierArriveForm from '../../components/CourrierArriveForm';
import { useEffect } from 'react';

export default function CourrierArrivePage() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.location.replace('/courrier-arrive');
    }
  }, []);

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Redirection en cours...</p>
      </div>
    </Layout>
  );
}
