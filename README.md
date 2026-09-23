# ClinicHub — Smart Clinic Management System

A full-stack web application designed to simplify and centralize the management of patients, doctors, appointments, and daily clinic operations.

**Project Status:** In Development

---

## Overview

ClinicHub is a modern clinic management system designed to help medical clinics organize their daily activities through a centralized digital platform.

The application focuses on managing:

* Patients
* Doctors
* Appointments
* Users and access control
* Clinic information
* Administrative operations

The project is being developed with a focus on clean architecture, maintainable code, security, scalability, and a professional user experience.

---

## Objectives

The main objectives of ClinicHub are to:

* Digitize common clinic management tasks
* Centralize patient and doctor information
* Simplify appointment management
* Reduce manual administrative work
* Improve organization of clinic operations
* Provide controlled access to application resources
* Build a maintainable foundation for future development

---

## Core Features

### Patient Management

* Create patient profiles
* Update patient information
* View patient details
* Search patients
* Manage patient information

### Doctor Management

* Create doctor profiles
* Update doctor information
* Manage doctor specializations
* View doctor information
* Search doctors

### Appointment Management

* Create appointments
* Update appointments
* Cancel appointments
* View upcoming appointments
* Manage appointment status
* Associate appointments with doctors and patients

### User Management

* User accounts
* User roles
* Access control
* Account management

### Dashboard

The dashboard will provide an overview of clinic activity, including:

* Number of patients
* Number of doctors
* Upcoming appointments
* Appointment statistics

---

## Architecture

ClinicHub follows a modular full-stack architecture that separates the frontend, backend, business logic, and data access layers.

```text
                    +----------------------+
                    |       Frontend       |
                    |       React.js       |
                    +----------+-----------+
                               |
                               | HTTP / REST API
                               |
                    +----------v-----------+
                    |       Backend        |
                    |       NestJS          |
                    +----------+-----------+
                               |
                               |
                    +----------v-----------+
                    |        Prisma        |
                    |    ORM / Data Layer  |
                    +----------+-----------+
                               |
                               |
                    +----------v-----------+
                    |       Database       |
                    |      PostgreSQL      |
                    +----------------------+
```

### Backend Architecture

The NestJS backend is organized into independent modules responsible for specific business domains.

```text
Backend
│
├── Auth
├── Users
├── Patients
├── Doctors
├── Appointments
├── Prisma
└── Common
```

This modular structure makes the application easier to maintain, test, and extend.

---

## Technology Stack

### Frontend

* React.js
* JavaScript
* Vite
* Tailwind CSS
* React Router
* Axios

### Backend

* Node.js
* NestJS
* TypeScript
* REST API

### Database

* PostgreSQL
* Prisma ORM

### Development Tools

* Git
* GitHub
* Visual Studio Code
* Postman
* ESLint
* Prettier

---

## Project Structure

```text
clinichub/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── utils/
│   │
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── patients/
│   │   ├── doctors/
│   │   ├── appointments/
│   │   ├── prisma/
│   │   └── common/
│   │
│   ├── prisma/
│   │   └── schema.prisma
│   │
│   └── package.json
│
├── .gitignore
├── README.md
└── LICENSE
```

The project structure may evolve during development as new requirements and modules are introduced.

---

## Getting Started

### Prerequisites

Make sure the following software is installed:

* Node.js
* npm
* PostgreSQL
* Git
* Visual Studio Code

### Clone the Repository

```bash
git clone https://github.com/DerbaliAdem/clinichub.git
```

```bash
cd clinichub
```

### Install Dependencies

Install frontend dependencies:

```bash
cd frontend
npm install
```

Install backend dependencies:

```bash
cd ../backend
npm install
```

### Environment Configuration

Create a `.env` file inside the backend directory.

Example:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/clinichub"
```

Do not commit sensitive credentials or environment variables to the repository.

### Database Setup

After configuring the database connection, generate the Prisma Client:

```bash
npx prisma generate
```

Run the database migrations:

```bash
npx prisma migrate dev
```

### Run the Backend

```bash
cd backend
npm run start:dev
```

### Run the Frontend

Open a separate terminal:

```bash
cd frontend
npm run dev
```

---

## Security

Security is an important part of the application's development.

Current and planned security practices include:

* Input validation
* Secure password handling
* Role-based access control
* Protected API routes
* Environment variable protection
* Proper error handling
* Database validation

Security features will be implemented progressively as the authentication and authorization modules are developed.

ClinicHub is currently a development and portfolio project. It should not be used with real patient data without appropriate security, privacy, compliance, and legal controls.

---

## Testing

Testing will be progressively introduced throughout the development process.

Planned testing includes:

* Backend API testing
* Unit testing
* Integration testing
* Frontend component testing
* End-to-end testing
