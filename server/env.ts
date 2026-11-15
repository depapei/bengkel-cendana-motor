export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Environment variable ${name} belum diisi (lihat .env.example)`);
  return value;
}
