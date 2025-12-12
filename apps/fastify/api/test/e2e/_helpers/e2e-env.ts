export function getE2eBaseUrl(): string {
  const v = process.env.E2E_BASE_URL;
  if (!v) throw new Error('E2E_BASE_URL is not set. Did globalSetup run?');
  return v;
}

export function getE2eApiKey(): string {
  const v = process.env.E2E_API_KEY;
  if (!v) throw new Error('E2E_API_KEY is not set. Did globalSetup run?');
  return v;
}


