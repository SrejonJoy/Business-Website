# Lightweight PHP 8.2 runtime for Laravel on Railway using the built-in server
FROM php:8.2-cli-alpine

# Install system deps and PHP extensions required by Laravel + MySQL
RUN apk add --no-cache bash git curl libzip-dev oniguruma-dev icu-dev unzip \
    && docker-php-ext-install pdo_mysql bcmath mbstring intl zip \
    && rm -rf /var/cache/apk/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copy composer manifests separately to leverage Docker layer caching
COPY composer.json composer.lock* ./

# Install PHP dependencies (no dev) and optimize autoloader
RUN composer install --no-dev --prefer-dist --no-interaction --no-progress --optimize-autoloader || true

# Copy the rest of the application
COPY . .

# Expose default port (Railway will set $PORT at runtime; we default to 8080)
EXPOSE 8080

# Start Laravel via PHP built-in server. Honors $PORT provided by Railway.
CMD ["sh", "-c", "php -S 0.0.0.0:${PORT:-8080} -t public public/index.php"]
