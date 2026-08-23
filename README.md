# Wordpress Boilerplate Generator

Generates a theme or plugin boilerplate for wordpress.

These are not base boilerplates in structure or tooling. Developer tools include docker, webpack, composer autoloading, and some other custom scripts.

## Usage

Clone or download the repository

```bash
npm install

npm start

```

Follow the prompts to fill in relavant information. Then cd into the created boilerplate.

```bash
npm install

composer install

composer dump-autoload

```

And to develop

```bash
docker compose up -d

npm run dev

```

## Boilerplate Usage

### Folder Structure

All php files reside in `inc`. All `psr-4` classes will be autoloaded via `composer` from the `inc/app` folder.

All raw js, css, and blocks reside in `src`. These are files that need to be built during the build process.

### Webpack

Webpack and `@wordpress/scripts` ares set to serve js and scss. All files will be built from `src` to the `build` folder.

### Docker

Docker set up to control the development environment. You must have `docker` and `docker-compose` installed.

Docker env variables for php and wordpress versions will be set in `.env`. The wordpress `debug.log` file from the docker container will be placed in the projects root directory.

### Tests

You have the choice whether or not to install tests. Js testing is done with `vitest` and php testig is done with `phpunit` and the wordpress phpunit test suite.

for js run

```bash
npm run test
```

for php run

```bash
composer test
```

The wordpress testing suits are installed from `https://develop.svn.wordpress.org/tags`. It will be installed via custom composer repository and use whatever wordpress version you picked when running the init script.

## License

This software is licensed under the GPLG license. See [LICENSE](https://github.com/stevekanger/wp-boilerplate-generator/blob/main/LICENSE) for more information.
