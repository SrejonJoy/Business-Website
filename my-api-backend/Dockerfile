# Lightweight PHP 8.2 runtime for Laravel on Railway using the built-in server
FROM php:8.2-cli-alpine

# Install system deps and PHP extensions required by Laravel + MySQL
RUN apk add --no-cache bash git curl libzip-dev oniguruma-dev icu-dev unzip \
    && docker-php-ext-install pdo_mysql bcmath mbstring intl zip \
    && rm -rf /var/cache/apk/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Composer runs as root inside container builds; suppress warning
ENV COMPOSER_ALLOW_SUPERUSER=1

# Copy composer manifests separately to leverage Docker layer caching
COPY composer.json composer.lock* ./

# First install: warm vendor cache without running scripts (artisan not copied yet)
RUN composer install --no-dev --no-scripts --prefer-dist --no-interaction --no-progress

# Copy the rest of the application
COPY . .

# Ensure runtime writable directories exist and are permissive for PaaS ephemeral FS
RUN mkdir -p storage/framework/{cache,sessions,views} bootstrap/cache \
    && chmod -R 777 storage bootstrap/cache

# Ensure vendor is up to date after full source is copied (now scripts can run)
RUN composer install --no-dev --prefer-dist --no-interaction --no-progress --optimize-autoloader

# Expose default port (Railway will set $PORT at runtime; we default to 8080)
EXPOSE 8080

# Start Laravel via PHP built-in server. Honors $PORT provided by Railway.
# Ensure session storage exists at runtime (Railway ephemeral FS may not preserve build-time dirs)
CMD ["sh", "-c", "mkdir -p storage/framework/sessions storage/framework/views storage/framework/cache && chmod -R 777 storage bootstrap/cache && php -S 0.0.0.0:${PORT:-8080} -t public public/index.php"]
