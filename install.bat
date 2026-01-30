@echo off
echo ================================
echo Instalando Sistema Docente
echo ================================

echo.
echo [1/7] Copiando archivo de configuracion...
copy .env.example .env

echo.
echo [2/7] Construyendo contenedores...
docker compose build --no-cache

echo.
echo [3/7] Levantando servicios...
docker compose up -d

echo.
echo [4/7] Esperando a que la base de datos este lista...
timeout /t 10

echo.
echo [5/7] Instalando dependencias PHP...
docker compose exec app composer install --no-interaction

echo.
echo [6/7] Instalando dependencias Node...
docker compose exec app npm install
docker compose exec app npm run build

echo.
echo [7/7] Configurando Laravel...
docker compose exec app php artisan key:generate
docker compose exec app chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
docker compose exec app chmod -R 775 /var/www/storage /var/www/bootstrap/cache
docker compose exec app php artisan storage:link
docker compose exec app php artisan migrate --force

echo.
echo ================================
echo Instalacion completada!
echo ================================
echo.
echo Accede al sistema en: http://localhost:8000
echo.
echo Para crear un usuario admin ejecuta:
echo docker compose exec app php artisan tinker
echo.
pause