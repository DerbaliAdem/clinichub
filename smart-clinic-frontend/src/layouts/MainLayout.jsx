import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function MainLayout({ children }) {
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    {
      name: 'Dashboard',
      path: '/dashboard',
    },
    {
      name: 'Doctors',
      path: '/doctors',
    },
    {
      name: 'Patients',
      path: '/patients',
    },
    {
      name: 'Appointments',
      path: '/appointments',
    },
  ];

  const user = JSON.parse(localStorage.getItem('user'));

  function handleLogout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');

    window.location.href = '/login';
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  function renderNavigation() {
    return navigation.map((item) => {
      const isActive = location.pathname === item.path;

      return (
        <Link
          key={item.path}
          to={item.path}
          onClick={closeMobileMenu}
          className={`block rounded-lg px-4 py-3 text-sm font-medium transition ${
            isActive
              ? 'bg-blue-600 text-white'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          {item.name}
        </Link>
      );
    });
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 bg-slate-950 text-white md:block">
        <div className="border-b border-slate-800 px-6 py-6">
          <h1 className="text-xl font-bold">
            Smart Clinic
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Management System
          </p>
        </div>

        <nav className="mt-6 space-y-2 px-3">
          {renderNavigation()}
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-64 bg-slate-950 text-white transition-transform duration-200 md:hidden ${
          mobileMenuOpen
            ? 'translate-x-0'
            : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-6">
          <div>
            <h1 className="text-xl font-bold">
              Smart Clinic
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Management System
            </p>
          </div>

          <button
            type="button"
            onClick={closeMobileMenu}
            className="rounded-lg px-2 py-1 text-2xl text-slate-300 hover:bg-slate-800 hover:text-white"
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        <nav className="mt-6 space-y-2 px-3">
          {renderNavigation()}
        </nav>
      </aside>

      <div className="md:ml-64">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between px-4 py-4 md:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-xl text-slate-700 hover:bg-slate-100 md:hidden"
                aria-label="Open menu"
              >
                ☰
              </button>

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Smart Clinic
                </h2>

                <p className="hidden text-sm text-slate-500 sm:block">
                  Clinic Management Dashboard
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 md:gap-4">
              {user && (
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold text-slate-900">
                    {user.firstName} {user.lastName}
                  </p>

                  <p className="text-xs text-slate-500">
                    {user.role}
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;