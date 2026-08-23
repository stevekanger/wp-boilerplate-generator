# Stage 1: Get the official php apache image from dockerhub
ARG PHP_VERSION
FROM php:${PHP_VERSION}-apache

# Stage 2: Install wordpress and dependencies
ARG WORDPRESS_VERSION
WORKDIR /var/www/html

# Install system dependencies and PHP extensions
RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends ghostscript curl; \
    rm -rf /var/lib/apt/lists/*

# Install GD and Imagick for image processing (required by SEO plugins like Rank Math, Yoast)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpng-dev libjpeg-dev libwebp-dev libmagickwand-dev && \
    docker-php-ext-configure gd --with-jpeg --with-webp && \
    docker-php-ext-install gd && \
    pecl install imagick && \
    docker-php-ext-enable imagick

# Install mysqli for WordPress database connection
RUN docker-php-ext-install mysqli

# Enable Apache modules
RUN a2enmod rewrite expires

# Install in wordpress
RUN mkdir -p /usr/src/wordpress && \
    curl -fsL https://wordpress.org/wordpress-${WORDPRESS_VERSION}.tar.gz | \
    tar -xz -C /usr/src/wordpress --strip-components=1

# Install the wordpress entrypoint.sh and wp-docker-config.php from github docker library
ADD https://raw.githubusercontent.com/docker-library/wordpress/master/wp-config-docker.php /usr/src/wordpress/wp-config-docker.php
ADD https://raw.githubusercontent.com/docker-library/wordpress/master/docker-entrypoint.sh /usr/local/bin/

# Set permissions for wordpress directory and entrypoint.sh
RUN chown -R www-data:www-data /usr/src/wordpress
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["apache2-foreground"]
