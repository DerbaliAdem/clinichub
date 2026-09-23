import { useEffect, useState } from 'react';

import api from '../services/api';

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  const [form, setForm] = useState({
    doctorId: '',
    patientId: '',
    date: '',
    reason: '',
  });

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function fetchData() {
    try {
      const [
        appointmentsResponse,
        doctorsResponse,
        patientsResponse,
      ] = await Promise.all([
        api.get('/appointments'),
        api.get('/doctors'),
        api.get('/patients'),
      ]);

      setAppointments(appointmentsResponse.data);
      setDoctors(doctorsResponse.data);
      setPatients(patientsResponse.data);
    } catch (error) {
      console.error('Error loading appointment data:', error);
      setError('Unable to load appointment data.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm({
      ...form,
      [name]: value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError('');
    setSuccess('');

    try {
      setCreating(true);

      await api.post('/appointments', {
        doctorId: Number(form.doctorId),
        patientId: Number(form.patientId),
        date: new Date(form.date).toISOString(),
        reason: form.reason || undefined,
      });

      setSuccess('Appointment created successfully.');

      setForm({
        doctorId: '',
        patientId: '',
        date: '',
        reason: '',
      });

      await fetchData();
    } catch (error) {
      console.error('Error creating appointment:', error);

      if (error.response?.data?.message) {
        setError(
          Array.isArray(error.response.data.message)
            ? error.response.data.message.join(', ')
            : error.response.data.message,
        );
      } else {
        setError('Unable to create appointment.');
      }
    } finally {
      setCreating(false);
    }
  }

  async function updateStatus(appointmentId, status) {
    setError('');
    setSuccess('');

    try {
      setUpdatingId(appointmentId);

      await api.patch(`/appointments/${appointmentId}`, {
        status,
      });

      setSuccess('Appointment status updated successfully.');

      await fetchData();
    } catch (error) {
      console.error('Error updating appointment:', error);

      if (error.response?.data?.message) {
        setError(
          Array.isArray(error.response.data.message)
            ? error.response.data.message.join(', ')
            : error.response.data.message,
        );
      } else {
        setError('Unable to update appointment.');
      }
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(appointment) {
    const patientName = `${appointment.patient.user.firstName} ${appointment.patient.user.lastName}`;

    const confirmed = window.confirm(
      `Are you sure you want to delete the appointment for ${patientName}?`,
    );

    if (!confirmed) {
      return;
    }

    setError('');
    setSuccess('');

    try {
      setDeletingId(appointment.id);

      await api.delete(`/appointments/${appointment.id}`);

      setSuccess('Appointment deleted successfully.');

      await fetchData();
    } catch (error) {
      console.error('Error deleting appointment:', error);

      if (error.response?.data?.message) {
        setError(
          Array.isArray(error.response.data.message)
            ? error.response.data.message.join(', ')
            : error.response.data.message,
        );
      } else {
        setError('Unable to delete appointment.');
      }
    } finally {
      setDeletingId(null);
    }
  }

  function formatDate(date) {
    return new Date(date).toLocaleString();
  }

  function getStatusClasses(status) {
    if (status === 'CONFIRMED') {
      return 'bg-green-100 text-green-700';
    }

    if (status === 'COMPLETED') {
      return 'bg-blue-100 text-blue-700';
    }

    if (status === 'CANCELLED') {
      return 'bg-red-100 text-red-700';
    }

    return 'bg-yellow-100 text-yellow-700';
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Appointments
        </h1>

        <p className="mt-1 text-slate-500">
          Schedule and manage clinic appointments.
        </p>
      </div>

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Create Appointment
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Schedule an appointment between a doctor and a
            patient.
          </p>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">
            Loading doctors and patients...
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="grid gap-5 md:grid-cols-2"
          >
            <div>
              <label
                htmlFor="doctorId"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Doctor
              </label>

              <select
                id="doctorId"
                name="doctorId"
                value={form.doctorId}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">
                  Select a doctor
                </option>

                {doctors.map((doctor) => (
                  <option
                    key={doctor.id}
                    value={doctor.id}
                  >
                    Dr. {doctor.user.firstName}{' '}
                    {doctor.user.lastName} -{' '}
                    {doctor.specialty}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="patientId"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Patient
              </label>

              <select
                id="patientId"
                name="patientId"
                value={form.patientId}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">
                  Select a patient
                </option>

                {patients.map((patient) => (
                  <option
                    key={patient.id}
                    value={patient.id}
                  >
                    {patient.user.firstName}{' '}
                    {patient.user.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="date"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Date and Time
              </label>

              <input
                id="date"
                name="date"
                type="datetime-local"
                value={form.date}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="reason"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Reason
              </label>

              <input
                id="reason"
                name="reason"
                type="text"
                placeholder="Regular consultation"
                value={form.reason}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={creating}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creating
                  ? 'Creating Appointment...'
                  : 'Create Appointment'}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="rounded-xl bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Appointment List
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {appointments.length} appointment
            {appointments.length !== 1 ? 's' : ''} found.
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <p className="text-slate-500">
              Loading appointments...
            </p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-500">
              No appointments found.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr className="text-sm text-slate-500">
                  <th className="px-6 py-4 font-medium">
                    Patient
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Doctor
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Date
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Reason
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right font-medium">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {appointments.map((appointment) => (
                  <tr
                    key={appointment.id}
                    className="border-t border-slate-100"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-900">
                          {
                            appointment.patient.user
                              .firstName
                          }{' '}
                          {
                            appointment.patient.user
                              .lastName
                          }
                        </p>

                        <p className="text-xs text-slate-500">
                          {
                            appointment.patient.user
                              .email
                          }
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-900">
                          Dr.{' '}
                          {
                            appointment.doctor.user
                              .firstName
                          }{' '}
                          {
                            appointment.doctor.user.lastName
                          }
                        </p>

                        <p className="text-xs text-slate-500">
                          {appointment.doctor.specialty}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {formatDate(appointment.date)}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {appointment.reason ||
                        'No reason provided'}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                          appointment.status,
                        )}`}
                      >
                        {appointment.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-wrap justify-end gap-2">
                        {appointment.status !==
                          'CONFIRMED' &&
                          appointment.status !==
                            'COMPLETED' &&
                          appointment.status !==
                            'CANCELLED' && (
                            <button
                              type="button"
                              onClick={() =>
                                updateStatus(
                                  appointment.id,
                                  'CONFIRMED',
                                )
                              }
                              disabled={
                                updatingId ===
                                appointment.id
                              }
                              className="rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-60"
                            >
                              Confirm
                            </button>
                          )}

                        {appointment.status ===
                          'CONFIRMED' && (
                          <button
                            type="button"
                            onClick={() =>
                              updateStatus(
                                appointment.id,
                                'COMPLETED',
                              )
                            }
                            disabled={
                              updatingId === appointment.id
                            }
                            className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                          >
                            Complete
                          </button>
                        )}

                        {appointment.status !==
                          'COMPLETED' &&
                          appointment.status !==
                            'CANCELLED' && (
                            <button
                              type="button"
                              onClick={() =>
                                updateStatus(
                                  appointment.id,
                                  'CANCELLED',
                                )
                              }
                              disabled={
                                updatingId ===
                                appointment.id
                              }
                              className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                            >
                              Cancel
                            </button>
                          )}

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(appointment)
                          }
                          disabled={
                            deletingId === appointment.id
                          }
                          className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                        >
                          {deletingId === appointment.id
                            ? 'Deleting...'
                            : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Appointments;