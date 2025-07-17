import Layout from '../../components/Layout';
import CourrierDepartForm from '../../components/CourrierDepartForm';

export default function Depart() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <CourrierDepartForm />
      </div>
    </Layout>
  );
}
