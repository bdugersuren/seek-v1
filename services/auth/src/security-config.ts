const PLACEHOLDER_SECRET_PATTERNS = [
  "seek_jwt_secret_key_placeholder",
  "placeholder",
  "change_me",
  "changeme",
  "secret",
];

export function validateProductionAuthConfig(serviceName: string): void {
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  const secret = process.env.AUTH_JWT_SECRET || "";
  const normalized = secret.toLowerCase();
  const hasPlaceholder = PLACEHOLDER_SECRET_PATTERNS.some((pattern) =>
    normalized.includes(pattern),
  );

  console.log(`[DEBUG JWT SECRET] service=${serviceName} len=${secret.length} hasPlaceholder=${hasPlaceholder} val="${secret}"`);

  if (!secret || secret.length < 32 || hasPlaceholder) {
    throw new Error(
      `CRITICAL: ${serviceName} requires a non-placeholder AUTH_JWT_SECRET with at least 32 characters in production mode.`,
    );
  }

  if (process.env.AUTH_COOKIE_SECURE !== "true") {
    throw new Error(
      `CRITICAL: ${serviceName} requires AUTH_COOKIE_SECURE=true in production mode.`,
    );
  }
}
