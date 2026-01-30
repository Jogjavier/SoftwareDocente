# Sistema de Profesionalización Docente

## Requisitos
- Docker Desktop instalado
- Git (opcional)

## Instalación

### 1. Descargar el proyecto
Extrae el archivo ZIP en una carpeta de tu computadora, por ejemplo: `C:\Proyectos\SoftwareDocente`

### 2. Configurar variables de entorno
```bash
# Copiar el archivo de ejemplo
copy .env.example .env
```

### 3. Levantar los contenedores
```bash
docker compose build --no-cache
docker compose up -d
```

### 4. Instalar dependencias
```bash
docker compose exec app composer install --no-interaction
docker compose exec app npm install
docker compose exec app npm run build
```

### 5. Configurar Laravel
```bash
# Generar key de aplicación
docker compose exec app php artisan key:generate

# Dar permisos
docker compose exec app chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
docker compose exec app chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Crear symlink de storage
docker compose exec app php artisan storage:link

# Ejecutar migraciones
docker compose exec app php artisan migrate --force

# Crear usuario admin
docker compose exec app php artisan tinker
```

Dentro de tinker:
```php
App\Models\User::create([
    'name' => 'Admin',
    'email' => 'admin@example.com',
    'password' => bcrypt('password123'),
    'role' => 'admin'
]);
exit
```

### 6. Acceder al sistema
Abre tu navegador en: http://localhost:8000

**Credenciales por defecto:**
- Email: admin@example.com
- Password: password123

## Comandos útiles

### Ver logs
```bash
docker compose logs -f
```

### Reiniciar servicios
```bash
docker compose restart
```

### Detener servicios
```bash
docker compose down
```

### Acceder al contenedor
```bash
docker compose exec app bash
```

## Solución de problemas

### Error de puerto 5432 ocupado
Si tienes otro PostgreSQL corriendo, cambia el puerto en `docker-compose.yml`:
```yaml
ports:
  - "5433:5432"  # Cambiar 5432 a 5433
```

### Error de permisos
```bash
docker compose exec app chown -R www-data:www-data /var/www
docker compose exec app chmod -R 775 /var/www/storage
```

### Limpiar todo y empezar de cero
```bash
docker compose down -v
docker compose build --no-cache
docker compose up -d
```