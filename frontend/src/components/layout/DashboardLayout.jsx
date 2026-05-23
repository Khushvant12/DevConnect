import DashboardSidebar from '../dashboard/DashboardSidebar.jsx';

export default function DashboardLayout({ children }) {
  return (
    <div className="page-container animate-fade-in py-6 sm:py-8 lg:py-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        <DashboardSidebar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
