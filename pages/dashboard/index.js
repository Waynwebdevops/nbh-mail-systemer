import Layout from '../../components/Layout';
import RoleGuard from '../../components/RoleGuard';
import Dashboard from '../../components/Dashboard';

export default function DashboardPage() {
  return (
    <RoleGuard allowedRoles={['admin','employe','rh','manager']}>
      <Layout>
        <Dashboard />
      </Layout>
    </RoleGuard>
  );
}