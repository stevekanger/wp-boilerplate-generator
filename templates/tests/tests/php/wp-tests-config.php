<?php

declare(strict_types=1);

// Path to the WordPress codebase you'd like to test. Add a forward slash in the end.
define('ABSPATH', '/var/www/html/');

/*
 * Path to the theme to test with.
 *
 * The 'default' theme is symlinked from test/phpunit/data/themedir1/default into
 * the themes directory of the WordPress installation defined above.
 */
define('WP_DEFAULT_THEME', 'default');

/*
 * Test with multisite enabled.
 * Alternatively, use the tests/phpunit/multisite.xml configuration file.
 */
// define( 'WP_TESTS_MULTISITE', true );

/*
 * Force known bugs to be run.
 * Tests with an associated Trac ticket that is still open are normally skipped.
 */
// define( 'WP_TESTS_FORCE_KNOWN_BUGS', true );

// Test with WordPress debug mode (default).
define('WP_DEBUG', true);

// ** Database settings ** //

/*
 * This configuration file will be used by the copy of WordPress being tested.
 * wordpress/wp-config.php will be ignored.
 *
 * WARNING WARNING WARNING!
 * These tests will DROP ALL TABLES in the database with the prefix named below.
 * DO NOT use a production database or one that is shared with something else.
 */

define('DB_NAME', getenv('WORDPRESS_DB_NAME'));
define('DB_USER', getenv('WORDPRESS_DB_USER'));
define('DB_PASSWORD', getenv('WORDPRESS_DB_PASSWORD'));
define('DB_HOST', getenv('WORDPRESS_DB_HOST'));
define('DB_CHARSET', 'utf8mb4');
define('DB_COLLATE', '');

/*#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 */
define('AUTH_KEY', getenv('WORDPRESS_AUTH_KEY'));
define('SECURE_AUTH_KEY', getenv('WORDPRESS_SECURE_KEY'));
define('LOGGED_IN_KEY', getenv('WORDPRESS_LOGGED_IN_KEY'));
define('NONCE_KEY', getenv('WORDPRESS_NONCE_KEY'));
define('AUTH_SALT', getenv('WORDPRESS_AUTH_SALT'));
define('SECURE_AUTH_SALT', getenv('WORDPRESS_SECURE_AUTH_SALT'));
define('LOGGED_IN_SALT', getenv('WORDPRESS_LOGGED_IN_SALT'));
define('NONCE_SALT', getenv('WORDPRESS_NONCE_SALT'));

$table_prefix = getenv('WORDPRESS_TABLE_PREFIX');   // Only numbers, letters, and underscores please!

define('WP_TESTS_DOMAIN', getenv('WORDPRESS_TESTS_DOMAIN'));
define('WP_TESTS_EMAIL', getenv('WORDPRESS_TESTS_EMAIL'));
define('WP_TESTS_TITLE', getenv('WORDPRESS_TESTS_TITLE'));

define('WP_PHP_BINARY', 'php');

define('WPLANG', '');

/*
 * Additional to defaut config
 */
define('FS_METHOD', 'direct');
