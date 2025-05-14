# 📘 Documentación Técnica – App “Naranja Mecánica Frontend”

## 🧩 General

- **Tipo de proyecto:** Web app de fútbol amateur  
- **Nombre:** Naranja Mecánica  
- **Frontend:** React + Tailwind CSS  
- **Backend:** Node.js (Express)  
- **Base de datos:** MySQL  

### Autenticación simple

- `POST /api/auth/login` → Login admin (usa `.env` para email y contraseña)

## 🖼️ Frontend (React)

### Principales páginas

| Ruta                   | Descripción                                 |
|------------------------|---------------------------------------------|
| `/`                    | Listado de jugadores (cards tipo FIFA)      |
| `/rankings`           | Rankings por estadísticas                   |
| `/calendario`         | Partidos pasados y próximos con filtro      |
| `/admin`              | Carga de partidos + estadísticas            |
| `/cargar-jugador`     | Formulario básico de jugador                |
| `/agregar-jugador`    | Formulario completo de jugador              |
| `/jugador/:id`        | Detalle individual con historial de partidos|

### Componentes clave

- `JugadorCard.jsx` → Card visual estilo FIFA (con medalla si top 3)  
- `TopGoleadores.jsx` → Sección destacada con 🥇🥈🥉  
- `RankingTable.jsx` → Reutilizable para rankings  
- `PrivateRoute.jsx` → Protege páginas con login  

## 🔒 Login admin

- Requiere: `token = 'admin-token'` en localStorage  
- Login en `/login`  
- Rutas protegidas: `/admin`, `/cargar-jugador`, `/agregar-jugador`  

## ✅ Validaciones

- Campos obligatorios marcados en rojo si están vacíos  
- Número de camiseta requerido  
- Manejo de errores de conexión  
- Cards truncadas para evitar desbordes visuales

