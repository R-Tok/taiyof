import { createClient } from "microcms-js-sdk";

export class MicroCMSFetchError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "MicroCMSFetchError";
  }
}

export function isMicroCMSConfigured(): boolean {
  return Boolean(
    process.env.MICROCMS_SERVICE_DOMAIN && process.env.MICROCMS_API_KEY,
  );
}

export function getMicroCMSClient() {
  const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
  const apiKey = process.env.MICROCMS_API_KEY;

  if (!serviceDomain || !apiKey) {
    return null;
  }

  return createClient({
    serviceDomain,
    apiKey,
  });
}
