#  BrainDump

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

> **BrainDump** is a secure, Full-Stack note management application built with strict **Clean Architecture** and **Domain-Driven Design (DDD)** principles. 

It provides users with a premium glassmorphism interface to create, manage, and automatically generate note drafts using Google's Gemini AI, all backed by a heavily secured Node.js API.

<br/>

##  Key Features

* **AI Draft Generation:** Integrated Google Gemini AI to automatically generate rich-text note drafts based on user prompts.
* **Security:**
    * **Frontend:** Strict HTML sanitization using `DOMPurify` to prevent XSS attacks in the rich-text editor.
    * **Backend:** Fortified with `helmet` for HTTP headers, strict CORS policies, Rate Limiting, and centralized error handling to prevent stack-trace leaks.
* **Secure Authentication:** JWT-based session management, bcrypt password hashing, and stateless password recovery flows via the Brevo HTTP API.
* **Role-Based Access Control (RBAC):** Distinct `USER` and `ADMIN` roles. Admins have access to a dedicated dashboard to monitor user activity and platform metrics.
* **Advanced Rich Text & Tagging:** Integrated Tiptap editor for rich-text formatting, combined with a custom tag management system and smart filtering.
* **Premium UI/UX:** Fully responsive, accessible, Apple-style glassmorphism interface with dark mode support, animated SVGs, and a global toast notification system.

<br/>

## Architecture

The backend is strictly modeled after **Clean Architecture**, ensuring that the core business logic is entirely decoupled from external frameworks and delivery mechanisms.

* **`Domain Layer`**: Contains Enterprise business rules, Entities (`User`, `Note`), and interface Ports (`INoteRepository`, `IEmailService`).
* **`Application Layer`**: Contains the Application business rules (Use Cases like `CreateNoteUseCase`, `RegisterUserUseCase`). It orchestrates the flow of data to and from the entities.
* **`Infrastructure Layer`**: Contains Frameworks, Drivers, and Adapters (Express Controllers, MongoDB/Mongoose implementations, Brevo Email Service, Gemini AI Service).
  
<br/>

## Tech Stack

### Frontend Architecture
| Tool | Layer / Purpose |
| :--- | :--- |
| **React 19 + Vite** | Core UI library and bundler respectively |
| **TypeScript** | Strict static typing for type-safety |
| **Tailwind CSS v4** | Utility-first styling engine and glassmorphism design |
| **Tiptap** | Rich text editing engine |
| **React Hook Form + Zod** | Form handling and schema validation |
| **React Router v7** | Single Page Application (SPA) routing |
| **DOMPurify** | HTML sanitization and XSS attack prevention |

<br/>

### Backend Architecture
| Tool | Layer / Purpose |
| :--- | :--- |
| **Node.js + Express** | Runtime environment and HTTP framework |
| **MongoDB + Mongoose** | NoSQL data persistence and schema modeling |
| **Google Gemini AI** | Generative AI engine for automated drafts |
| **Brevo API** | HTTP transactional service for password recovery |
| **JWT & Bcrypt** | Stateless authentication and password hashing |
| **Helmet + Rate Limit** | Security headers hardening and traffic control |
| **Vitest** | Testing framework |

---

<br/>

##  Getting Started (Local Development)

### Prerequisites
* Node.js (v20 or higher recommended)
* MongoDB instance (Local or Atlas)
* Google Gemini API Key
* Brevo API Key

### 1. Clone the repository
```bash
git clone https://github.com/juanma-alb/braindump.git
cd braindump
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
// Core
FRONTEND_URL=http://localhost:5173
MONGODB_URI=your_mongodb_connection_string

// Security
JWT_SECRET=your_jwt_key 

// External Services
GEMINI_API_KEY=your_gemini_api_key
BREVO_API_KEY=your_brevo_api_key
SMTP_USER=your_verified_sender_email@domain.com
EMAIL_FROM="BrainDump App <no-reply@braindump.dev>"
```
Start the development server:
```bash
npm run dev 
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
<br/>

##  API Documentation & Testing

The repository includes a comprehensive `requests.http` file located in the backend root. 

**Testing the API:**
You can use the **REST Client** extension in VS Code or Cursor to trigger these requests directly from the editor.

**Admin Credentials:**
To explore the Administrative capabilities (`ADMIN` role), please use the `POST /api/auth/register` endpoint specified in the `requests.http` file to register your initial administrator account. Then, proceed to login and append the returned JWT Token to the global `@token` variable within the file.



