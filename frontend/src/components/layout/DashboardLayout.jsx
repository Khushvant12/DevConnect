import DashboardSidebar from '../dashboard/DashboardSidebar.jsx';

export default function DashboardLayout({ children }) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 lg:flex-row lg:px-8">
      <DashboardSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
