import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  name: process.env.APP_NAME ?? 'backend',
  port: Number(process.env.APP_PORT ?? 3000),
  jwtSecret: process.env.JWT_SECRET ?? 'local-development-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '1h',
  mobileAppCurrentVersion:
    process.env.MOBILE_APP_CURRENT_VERSION ?? '1.0.0-20260528',
  mobileAppMinimumVersion:
    process.env.MOBILE_APP_MINIMUM_VERSION ?? '1.0.0-20260528',
  mobileAppStoreUrl:
    process.env.MOBILE_APP_STORE_URL ??
    'https://apps.apple.com/app/id0000000000',
  mobilePlayStoreUrl:
    process.env.MOBILE_PLAY_STORE_URL ??
    'https://play.google.com/store/apps/details?id=com.example.mobile',
}));
