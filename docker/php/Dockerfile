FROM php:8.2-fpm

# Dependencias del sistema
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    libpq-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    nodejs \
    npm \
    iputils-ping \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Extensiones PHP (agregué pgsql también)
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd pdo pdo_pgsql pgsql

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Permisos base
RUN chown -R www-data:www-data /var/www

EXPOSE 9000

CMD ["php-fpm"]