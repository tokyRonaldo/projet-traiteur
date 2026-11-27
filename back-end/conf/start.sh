#!/usr/bin/env bash
set -e

# Run deploy scripts in number order
for script in /var/www/html/scripts/*; do
  bash "$script"
done

echo "=================================="
echo "Lancement des seeders Laravel"
echo "=================================="

php artisan db:seed --force

exec /usr/bin/supervisord -n -c /etc/supervisord.conf