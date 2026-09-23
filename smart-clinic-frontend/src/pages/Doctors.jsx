import { useEffect, useState } from 'react';

import api from '../services/api';

function Doctors() {
  const [doctors, setDoctors] = useState([]);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    specialty: '',
  });

  const [editingDoctorId, setEditingDoctorId] = useState(null);
  const [editingSpecialty, setEditingSpecialty] = useState('');

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deletingDoctorId, setDeletingDoctorId] = useState(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function fetchDoctors() {
    try {
      const response = await api.get('/doctors');

      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setError('Unable to load doctors.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDoctors();
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

      const userResponse = await api.post('/auth/register', {
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        role: 'DOCTOR',
      });

      const userId = userResponse.data.id;

      await api.post('/doctors', {
        userId,
        specialty: form.specialty,
      });

      setSuccess('Doctor created successfully.');

      setForm({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        specialty: '',
      });

      await fetchDoctors();
    } catch (error) {
      console.error('Error creating doctor:', error);

      if (error.response?.data?.message) {
        setError(
          Array.isArray(error.response.data.message)
            ? error.response.data.message.join(', ')
            : error.response.data.message,
        );
      } else {
        setError('Unable to create doctor.');
      }
    } finally {
      setCreating(false);
    }
  }

  function startEditing(doctor) {
    setEditingDoctorId(doctor.id);
    setEditingSpecialty(doctor.specialty);

    setError('');
    setSuccess('');
  }

  function cancelEditing() {
    setEditingDoctorId(null);
    setEditingSpecialty('');
  }

  async function handleUpdate(doctorId) {
    if (!editingSpecialty.trim()) {
      setError('Specialty cannot be empty.');
      return;
    }

    setError('');
    setSuccess('');

    try {
      setUpdating(true);

      await api.patch(`/doctors/${doctorId}`, {
        specialty: editingSpecialty,
      });

      setSuccess('Doctor updated successfully.');

      cancelEditing();

      await fetchDoctors();
    } catch (error) {
      console.error('Error updating doctor:', error);

      if (error.response?.data?.message) {
        setError(
          Array.isArray(error.response.data.message)
            ? error.response.data.message.join(', ')
            : error.response.data.message,
        );
      } else {
        setError('Unable to update doctor.');
      }
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete(doctor) {
    const doctorName = `Dr. ${doctor.user.firstName} ${doctor.user.lastName}`;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${doctorName}?`,
    );

    if (!confirmed) {
      return;
    }

    setError('');
    setSuccess('');

    try {
      setDeletingDoctorId(doctor.id);

      await api.delete(`/doctors/${doctor.id}`);

      setSuccess('Doctor deleted successfully.');

      await fetchDoctors();
    } catch (error) {
      console.error('Error deleting doctor:', error);

      if (error.response?.data?.message) {
        setError(
          Array.isArray(error.response.data.message)
            ? error.response.data.message.join(', ')
            : error.response.data.message,
        );
      } else {
        setError('Unable to delete doctor.');
      }
    } finally {
      setDeletingDoctorId(null);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Doctors
        </h1>

        <p className="mt-1 text-slate-500">
          Manage the doctors working in your clinic.
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
            Add Doctor
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Create a new doctor account and profile.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-5 md:grid-cols-2"
        >
          <div>
            <label
              htmlFor="firstName"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              First Name
            </label>

            <input
              id="firstName"
              name="firstName"
              type="text"
              value={form.firstName}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Ahmed"
            />
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Last Name
            </label>

            <input
              id="lastName"
              name="lastName"
              type="text"
              value={form.lastName}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Ben Ali"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="doctor@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Minimum 8 characters"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Phone
            </label>

            <input
              id="phone"
              name="phone"
              type="text"
              value={form.phone}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="+216 ..."
            />
          </div>

          <div>
            <label
              htmlFor="specialty"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Specialty
            </label>

            <input
              id="specialty"
              name="specialty"
              type="text"
              value={form.specialty}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Cardiology"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={creating}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {creating ? 'Creating Doctor...' : 'Create Doctor'}
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-xl bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Doctor List
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {doctors.length} doctor
            {doctors.length !== 1 ? 's' : ''} registered.
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <p className="text-slate-500">
              Loading doctors...
            </p>
          </div>
        ) : doctors.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-500">
              No doctors found.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr className="text-sm text-slate-500">
                  <th className="px-6 py-4 font-medium">
                    Doctor
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Specialty
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Email
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Phone
                  </th>

                  <th className="px-6 py-4 text-right font-medium">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {doctors.map((doctor) => (
                  <tr
                    key={doctor.id}
                    className="border-t border-slate-100"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                          {doctor.user.firstName.charAt(0)}
                          {doctor.user.lastName.charAt(0)}
                        </div>

                        <div>
                          <p className="font-medium text-slate-900">
                            Dr. {doctor.user.firstName}{' '}
                            {doctor.user.lastName}
                          </p>

                          <p className="text-xs text-slate-500">
                            ID #{doctor.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {editingDoctorId === doctor.id ? (
                        <input
                          type="text"
                          value={editingSpecialty}
                          onChange={(event) =>
                            setEditingSpecialty(
                              event.target.value,
                            )
                          }
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                      ) : (
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                          {doctor.specialty}
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {doctor.user.email}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {doctor.user.phone || 'Not provided'}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        {editingDoctorId === doctor.id ? (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdate(doctor.id)
                              }
                              disabled={updating}
                              className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                            >
                              {updating ? 'Saving...' : 'Save'}
                            </button>

                            <button
                              type="button"
                              onClick={cancelEditing}
                              disabled={updating}
                              className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                startEditing(doctor)
                              }
                              className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(doctor)
                              }
                              disabled={
                                deletingDoctorId ===
                                doctor.id
                              }
                              className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                            >
                              {deletingDoctorId === doctor.id
                                ? 'Deleting...'
                                : 'Delete'}
                            </button>
                          </>
                        )}
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

export default Doctors;