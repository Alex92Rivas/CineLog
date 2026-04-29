# Cinelog

Proyecto fullstack inspirado en Letterboxd para gestionar una colección personal de películas.# CineLog

## Descripción

CineLog es una aplicación fullstack desarrollada con React, TypeScript, Node.js y Express.

La aplicación permite buscar películas mediante la API de TMDB, añadirlas a una colección personal y gestionarlas mediante diferentes estados y filtros.

Este proyecto representa la evolución de los ejercicios anteriores TaskFlow y MovieNight Planner hacia una arquitectura fullstack moderna.

---

# Características principales

- Búsqueda de películas mediante TMDB
- Colección personalizada
- Gestión de películas vistas y pendientes
- Sistema de favoritas
- Filtros dinámicos
- Arquitectura React con Context API
- Hooks personalizados
- API REST con Express
- Tipado fuerte con TypeScript

---

# Tecnologías utilizadas

## Frontend

- React
- TypeScript
- Vite
- TailwindCSS
- React Router DOM

## Backend

- Node.js
- Express
- Nodemon
- dotenv
- CORS

## APIs externas

- TMDB API

---

# Estructura del proyecto

```txt
CineLog/
│
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── router/
│   │   └── types/
│
├── server/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   └── middleware/
│
├── docs/
└── README.md