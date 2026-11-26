#!/usr/bin/env bash
echo "Running composer"
composer install --no-dev --working-dir=/var/www/html

echo "Caching config..."
php artisan config:cache

echo "Caching routes..."
php artisan route:cache



echo "Running migrations..."
php artisan tinker --execute="echo 'DB user: '.config('database.connections.mysql.username').' host: '.config('database.connections.mysql.host').PHP_EOL;"
php artisan migrate --force