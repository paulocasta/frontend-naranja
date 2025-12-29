# 🚀 Guía de Deploy – Naranja Mecánica (Frontend en VPS con NGINX)

Esta guía explica cómo desplegar tu aplicación **React + Node.js + MySQL** en un VPS **sin dominio**, accediendo mediante la IP pública.

---

## ✅ 1. Construir el proyecto React

En tu VPS o en tu máquina local, dentro de la carpeta `frontend`:

```bash
npm install
npm run build
```

Esto genera una carpeta `build/` con los archivos listos para producción.

---

## ✅ 2. Crear carpeta pública en el VPS y copiar archivos

```bash
sudo mkdir -p /var/www/naranja/frontend
sudo cp -r build/* /var/www/naranja/frontend/
```

---

## ✅ 3. Crear archivo de configuración en NGINX

```bash
sudo nano /etc/nginx/sites-available/naranja
```

### ✏️ Pegá la siguiente configuración:

```nginx
server {
    listen 80;
    server_name _;

    root /var/www/naranja/frontend;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /uploads/ {
        alias /ruta/completa/a/backend/uploads/;
    }

    client_max_body_size 10M;
}
```

📌 **Importante:** Reemplazá `/ruta/completa/a/backend/uploads/` con la ruta real en tu VPS, como:

```nginx
/home/usuario/naranja/backend/uploads/
```

---

## ✅ 4. Activar configuración y desactivar la página por defecto

```bash
sudo ln -sf /etc/nginx/sites-available/naranja /etc/nginx/sites-enabled/naranja
sudo rm -f /etc/nginx/sites-enabled/default
```

---

## ✅ 5. Verificar y recargar NGINX

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## ✅ 6. Probar desde el navegador

Ingresá a:

```
http://<TU_IP_DEL_VPS>
```

Deberías ver tu aplicación React cargando correctamente.

---

## 🛠️ Extras

- Verificá que `index.html` exista:
```bash
ls /var/www/naranja/frontend/index.html
```

- Verificá permisos:
```bash
sudo chown -R www-data:www-data /var/www/naranja/frontend
```

---

## ✅ Listo

Tu frontend ya está corriendo desde el VPS con NGINX. El backend puede estar en puerto `3000`, conectado vía `/api/`.

## Docker
ejecutar `docker compose up -d` para levar el archivo dockker-compose.yml
`docker compose build` para crear una nueva version or actualizar la misma
`docker compose pull` para bajar una version