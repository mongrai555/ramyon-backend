import { ConfigService } from '@nestjs/config';

/** The secret that shipped with the sample project. Fine for localhost, fatal in public. */
const SAMPLE_SECRET = 'super_secret_food_ordering_jwt_key_123!';

/**
 * One place that decides the signing key. In production a missing or
 * left-over sample secret is a hole big enough to forge an admin token
 * through, so the app refuses to boot instead of quietly using it.
 */
export function jwtSecret(configService: ConfigService): string {
  const secret = configService.get<string>('JWT_SECRET');
  const isProd = configService.get<string>('NODE_ENV') === 'production';

  if (isProd && (!secret || secret === SAMPLE_SECRET)) {
    throw new Error(
      'JWT_SECRET must be set to a private value in production. Generate one with: ' +
        "node -e \"console.log(require('crypto').randomBytes(48).toString('base64url'))\"",
    );
  }

  return secret || SAMPLE_SECRET;
}
