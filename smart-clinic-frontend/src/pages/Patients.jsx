import { useEffect, useState } from 'react';

import api from '../services/api';

function Patients() {
  const [patients, setPatients] = useState([]);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    birthDate: '',
    address: '',
  });

  const [editingPatientId, setEditingPatientId] = useState(null);
  const [editingBirthDate, setEditingBirthDate] = useState('');
  const [editingAddress, setEditingAddress] = useState('');

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deletingPatientId, setDeletingPatientId] = useState(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function fetchPatients() {
    try {
      const response = await api.get('/patients');

      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setError('Unable to load patients.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPatients();
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
        role: 'PATIENT',
      });

      const userId = userResponse.data.id;

      await api.post('/patients', {
        userId,
        birthDate: form.birthDate || undefined,
        address: form.address || undefined,
      });

      setSuccess('Patient created successfully.');

      setForm({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        birthDate: '',
        address: '',
      });

      await fetchPatients();
    } catch (error) {
      console.error('Error creating patient:', error);

      if (error.response?.data?.message) {
        setError(
          Array.isArray(error.response.data.message)
            ? error.response.data.message.join(', ')
            : error.response.data.message,
        );
      } else {
        setError('Unable to create patient.');
      }
    } finally {
      setCreating(false);
    }
  }

  function startEditing(patient) {
    setEditingPatientId(patient.id);

    setEditingBirthDate(
      patient.birthDate
        ? patient.birthDate.substring(0, 10)
        : '',
    );

    setEditingAddress(patient.address || '');

    setError('');
    setSuccess('');
  }

  function cancelEditing() {
    setEditingPatientId(null);
    setEditingBirthDate('');
    setEditingAddress('');
  }

  async function handleUpdate(patientId) {
    setError('');
    setSuccess('');

    try {
      setUpdating(true);

      await api.patch(`/patients/${patientId}`, {
        birthDate: editingBirthDate || undefined,
        address: editingAddress || undefined,
      });

      setSuccess('Patient updated successfully.');

      cancelEditing();

      await fetchPatients();
    } catch (error) {
      console.error('Error updating patient:', error);

      if (error.response?.data?.message) {
        setError(
          Array.isArray(error.response.data.message)
            ? error.response.data.message.join(', ')
            : error.response.data.message,
        );
      } else {
        setError('Unable to update patient.');
      }
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete(patient) {
    const patientName = `${patient.user.firstName} ${patient.user.lastName}`;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${patientName}?`,
    );

    if (!confirmed) {
      return;
    }

    setError('');
    setSuccess('');

    try {
      setDeletingPatientId(patient.id);

      await api.delete(`/patients/${patient.id}`);

      setSuccess('Patient deleted successfully.');

      await fetchPatients();
    } catch (error) {
      console.error('Error deleting patient:', error);

      if (error.response?.data?.message) {
        setError(
          Array.isArray(error.response.data.message)
            ? error.response.data.message.join(', ')
            : error.response.data.message,
        );
      } else {
        setError('Unable to delete patient.');
      }
    } finally {
      setDeletingPatientId(null);
    }
  }

  function formatBirthDate(date) {
    if (!date) {
      return 'Not provided';
    }

    return new Date(date).toLocaleDateString();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Patients
        </h1>

        <p className="mt-1 text-slate-500">
          Manage patient information and profiles.
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
            Add Patient
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Create a new patient account and profile.
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
              placeholder="Mohamed"
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
              placeholder="Ali"
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
              placeholder="patient@example.com"
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
              htmlFor="birthDate"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Birth Date
            </label>

            <input
              id="birthDate"
              name="birthDate"
              type="date"
              value={form.birthDate}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="address"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Address
            </label>

            <input
              id="address"
              name="address"
              type="text"
              value={form.address}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Monastir, Tunisia"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={creating}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {creating ? 'Creating Patient...' : 'Create Patient'}
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-xl bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Patient List
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {patients.length} patient
            {patients.length !== 1 ? 's' : ''} registered.
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <p className="text-slate-500">
              Loading patients...
            </p>
          </div>
        ) : patients.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-500">
              No patients found.
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
                    Email
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Phone
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Birth Date
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Address
                  </th>

                  <th className="px-6 py-4 text-right font-medium">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {patients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="border-t border-slate-100"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
                          {patient.user.firstName.charAt(0)}
                          {patient.user.lastName.charAt(0)}
                        </div>

                        <div>
                          <p className="font-medium text-slate-900">
                            {patient.user.firstName}{' '}
                            {patient.user.lastName}
                          </p>

                          <p className="text-xs text-slate-500">
                            ID #{patient.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {patient.user.email}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {patient.user.phone || 'Not provided'}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {editingPatientId === patient.id ? (
                        <input
                          type="date"
                          value={editingBirthDate}
                          onChange={(event) =>
                            setEditingBirthDate(
                              event.target.value,
                            )
                          }
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                      ) : (
                        formatBirthDate(patient.birthDate)
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {editingPatientId === patient.id ? (
                        <input
                          type="text"
                          value={editingAddress}
                          onChange={(event) =>
                            setEditingAddress(
                              event.target.value,
                            )
                          }
                          className="w-48 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                      ) : (
                        patient.address || 'Not provided'
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        {editingPatientId === patient.id ? (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdate(patient.id)
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
                                startEditing(patient)
                              }
                              className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(patient)
                              }
                              disabled={
                                deletingPatientId ===
                                patient.id
                              }
                              className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                            >
                              {deletingPatientId === patient.id
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

export default Patients;