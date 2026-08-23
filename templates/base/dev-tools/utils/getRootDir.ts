import path from 'path';

/**
 * Gets the root directory and if path is provided then it will be appended.
 *
 * @param ...paths Any extra paths. They will be joined to the root dir with `path.join`
 * @return The full path to the root dir and any extra if passed in
 */
export default function getRootDir(...paths: string[]): string {
  return path.join(__dirname, '..', '..', ...paths);
}
