import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';

import Appointments from './pages/Appointments';
import Dashboard from './pages/Dashboard';
import Doctors from './pages/Doctors';
import Login from './pages/Login';
import Patients from './pages/Patients';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />

        <Route
          path="/doctors"
          element={
            <MainLayout>
              <Doctors />
            </MainLayout>
          }
        />

        <Route
          path="/patients"
          element={
            <MainLayout>
              <Patients />
            </MainLayout>
          }
        />

        <Route
          path="/appointments"
          element={
            <MainLayout>
              <Appointments />
            </MainLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;