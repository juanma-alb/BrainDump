# BrainDump API v1.0.0

Gestión de ideas y notas personales. Construida sobre **Clean Architecture**, **TypeScript estricto** y **Node.js**, integrando Inteligencia Artificial y seguridad robusta.

---

## Características Principales:

* **Autenticación y Autorización:** Registro seguro con Bcrypt, inicio de sesión basado en JWT y Control de Acceso por Roles (RBAC) aislando datos de `USER` y otorgando privilegios de supervisión al `ADMIN`.<br>
* **Recuperación de Contraseña Stateless:** Flujo seguro de "Olvidé mi contraseña" usando JWTs de un solo uso con secrets dinámicos y envío de emails vía Nodemailer.<br>
* **Inteligencia Artificial (Google Gemini):** Generación de borradores y redacción asistida por IA y Auto-etiquetado inteligente de notas según su contenido.<br>
* **Seguridad y Rendimiento:** Validación estricta de payloads con Zod, Rate Limiting para proteger cuotas de IA, y listados optimizados con Paginación y Filtrado de base de datos.

---

## Stack Tecnológico:

| Herramienta | Capa / Propósito |
| :--- | :--- |
| **Node.js + Express** | Framework y entorno |
| **TypeScript (Strict)** | Tipado estático y seguridad de dominio |
| **MongoDB + Mongoose** | Persistencia de datos (NoSQL) |
| **Zod** | Esquemas de validación y type-safety en runtime |
| **Google Generative AI** | SDK de Gemini (2.5 Flash) para features cognitivas |
| **Bcrypt & JsonWebToken** | Hashing y manejo de sesiones |
| **Nodemailer** | Servicio de mensajería SMTP |
| **Pino** | Logging asíncrono de alto rendimiento |
| **Vitest** | Framework de testing (Unitario/Integración) con soporte nativo TS |

---

##  Arquitectura

El proyecto sigue estrictamente los principios de **Clean Architecture** y **Separación de Intereses (SoC)**, garantizando que la lógica de negocio esté completamente aislada de frameworks, bases de datos y servicios externos.

```text

├── package.json
├── requests.http
├── src
│  ├── application
│  │  └── use-cases
│  │     └── __tests__
│  ├── domain
│  │  ├── entities
│  │  ├── ports
│  │  └── value-objects
│  ├── index.ts
│  └── infrastructure
│     ├── ai-service
│     ├── auth
│     ├── email
│     ├── http (controladores)
│     │  ├── middlewares
│     │  ├── schemas
│     │  └── Server.ts
│     ├── logger
│     └── repositories
│        └── models
├── tsconfig.json
└── vitest.config.ts


┌────────────────────────────────────────────────────────────┐
│                      Infrastructure                        │ ← Express, Mongoose, Gemini, Pino
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    Application                       │  │ ← Casos de Uso (RBAC, Orquestación)
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │                   Domain                       │  │  │ ← Entidades,Validaciones,Puertos
│  │  └────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘

```
---

## Comandos

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Compilar a JavaScript
npm run build

# Ejecutar tests en modo watch
npm test

# Ejecutar tests una sola vez
npm run test:run

# Generar reporte de cobertura
npm run test:coverage
```

---


