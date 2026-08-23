<?php

declare(strict_types=1);

namespace WpPluginBoilerplate\Core;

/**
 * Container for all services.
 *
 * @since 0.1.0
 */
final class Container {
    private array $bindings = [];
    private array $instances = [];

    /**
     * Bind services to the class.
     *
     * @param string   $id      Any string id to act as the service key
     * @param callable $factory A function that returns an instance of the Service
     *
     * @since 0.1.0
     */
    public function bind(string $id, callable $factory): void {
        $this->bindings[$id] = $factory;
    }

    /**
     * Bind services to the class.
     *
     * @template T
     *
     * @param class-string<T> $id The class id
     *
     * @return T
     *
     * @since 0.1.0
     */
    public function get(string $id): mixed {
        if (!isset($this->instances[$id])) {
            $this->instances[$id] = $this->bindings[$id]($this);
        }

        if (!isset($this->bindings[$id])) {
            throw new \Exception("No container binding found for {$id}");
        }

        return $this->instances[$id];
    }
}
