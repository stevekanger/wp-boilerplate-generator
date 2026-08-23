import { config } from 'dotenv';

config({ quiet: true });

export default function getEnv(val: string, fallback?: string): string {
  const envVar = process.env[val] ?? fallback;

  if (envVar === undefined) {
    throw new Error(`${val} not set in .env. No fallback provided.`);
  }

  return envVar;
}
