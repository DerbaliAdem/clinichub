import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import api from '../services/api';

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'));

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [
          doctorsResponse,
          patientsResponse,
          appointmentsResponse,
        ] = await Promise.all([
          api.get('/doctors'),
          api.get('/patients'),
          api.get('/appointments'),
        ]);

        setDoctors(doctorsResponse.data);
        setPatients(patientsResponse.data);
        setAppointments(appointmentsResponse.data);
      } catch (error) {
        console.error('Error loading dashboard:', error);
        setError('Unable to load dashboard data.');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const confirmedAppointments = appointments.filter(
    (appointment) => appointment.status === 'CONFIRMED',
  );

  const upcomingAppointments = appointments
    .filter(
      (appointment) =>
        new Date(appointment.date) > new Date(),
    )
    .slice(0, 5);

  function formatDate(date) {
    return new Date(date).toLocaleString();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="mt-1 text-slate-500">
          Welcome back, {user?.firstName || 'User'}.
          Here is what's happening in your clinic.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
          <p className="text-slate-500">
            Loading dashboard...
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Total Doctors
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {doctors.length}
              </p>

              <Link
                to="/doctors"
                className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                View doctors →
              </Link>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Total Patients
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {patients.length}
              </p>

              <Link
                to="/patients"
                className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                View patients →
              </Link>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Total Appointments
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {appointments.length}
              </p>

              <Link
                to="/appointments"
                className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                View appointments →
              </Link>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Confirmed
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {confirmedAppointments.length}
              </p>

              <span className="mt-4 inline-block text-sm text-slate-500">
                Confirmed appointments
              </span>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-xl bg-white p-6 shadow-sm lg:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Upcoming Appointments
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Your next scheduled appointments.
                  </p>
                </div>

                <Link
                  to="/appointments"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  View all
                </Link>
              </div>

              <div className="mt-6 overflow-x-auto">
                {upcomingAppointments.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No upcoming appointments.
                  </p>
                ) : (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-200 text-sm text-slate-500">
                        <th className="pb-3 font-medium">
                          Patient
                        </th>

                        <th className="pb-3 font-medium">
                          Doctor
                        </th>

                        <th className="pb-3 font-medium">
                          Date
                        </th>

                        <th className="pb-3 font-medium">
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {upcomingAppointments.map(
                        (appointment) => (
                          <tr
                            key={appointment.id}
                            className="border-b border-slate-100 last:border-0"
                          >
                            <td className="py-4 text-sm font-medium text-slate-900">
                              {
                                appointment.patient.user
                                  .firstName
                              }{' '}
                              {
                                appointment.patient.user
                                  .lastName
                              }
                            </td>

                            <td className="py-4 text-sm text-slate-600">
                              Dr.{' '}
                              {
                                appointment.doctor.user
                                  .firstName
                              }{' '}
                              {
                                appointment.doctor.user
                                  .lastName
                              }
                            </td>

                            <td className="py-4 text-sm text-slate-600">
                              {formatDate(appointment.date)}
                            </td>

                            <td className="py-4">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-medium ${
                                  appointment.status ===
                                  'CONFIRMED'
                                    ? 'bg-green-100 text-green-700'
                                    : appointment.status ===
                                        'CANCELLED'
                                      ? 'bg-red-100 text-red-700'
                                      : appointment.status ===
                                          'COMPLETED'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                }`}
                              >
                                {appointment.status}
                              </span>
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">
                Quick Actions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Common clinic operations.
              </p>

              <div className="mt-6 space-y-3">
                <Link
                  to="/doctors"
                  className="block rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  Manage Doctors
                </Link>

                <Link
                  to="/patients"
                  className="block rounded-lg border border-slate-300 px-4 py-3 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Manage Patients
                </Link>

                <Link
                  to="/appointments"
                  className="block rounded-lg border border-slate-300 px-4 py-3 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Manage Appointments
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;