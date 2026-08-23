import fs from 'fs';
import getRootDir from './getRootDir';
import getEnv from './getEnv';

export default function ensureDistDir(): string {
  const distDir = getRootDir(getEnv('WP_DIST_PATH'));

  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
  }

  return distDir;
}
