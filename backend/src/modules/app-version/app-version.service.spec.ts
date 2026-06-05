import { ConfigService } from '@nestjs/config';

import { AppVersionService, compareAppVersions } from './app-version.service';

describe('compareAppVersions', () => {
  it('compares semver core and YYYYMMDD availability suffix', () => {
    expect(compareAppVersions('3.1.2-20260601', '3.1.2-20260601')).toBe(0);
    expect(compareAppVersions('3.1.2 - 20260601', '3.1.2-20260601')).toBe(0);
    expect(compareAppVersions('3.1.2-20260601', '3.1.3-20260601')).toBe(-1);
    expect(compareAppVersions('3.2.0-20260601', '3.1.9-20251231')).toBe(1);
    expect(compareAppVersions('3.1.2-20260531', '3.1.2-20260601')).toBe(-1);
    expect(compareAppVersions('3.1.2-20251231', '3.1.2-20260101')).toBe(-1);
  });

  it('compares YYYYMMDD suffix without misreading as DDMMYYYY', () => {
    expect(compareAppVersions('1.0.0-20251231', '1.0.0-20260101')).toBe(-1);
    expect(compareAppVersions('1.0.0-20260101', '1.0.0-20251231')).toBe(1);
  });

  it('accepts legacy DDMMYYYY suffixes', () => {
    expect(compareAppVersions('1.0.0-28052026', '1.0.0-20260528')).toBe(0);
  });

  it('falls back to numeric build parts when suffix is not a calendar date', () => {
    expect(compareAppVersions('1.0.0-12345678', '1.0.0-12345679')).toBe(-1);
  });
});

describe('AppVersionService', () => {
  function createService(overrides: Record<string, string> = {}) {
    const values: Record<string, string> = {
      'app.mobileAppCurrentVersion': '1.2.0-20260601',
      'app.mobileAppMinimumVersion': '1.1.0-20260601',
      'app.mobileAppStoreUrl': 'https://apps.apple.com/app/id0000000000',
      'app.mobilePlayStoreUrl':
        'https://play.google.com/store/apps/details?id=com.example.mobile',
      ...overrides,
    };

    const configService = {
      getOrThrow: jest.fn((key: string) => {
        const value = values[key];

        if (!value) {
          throw new Error(`Missing config value for ${key}`);
        }

        return value;
      }),
    } as Partial<ConfigService> as ConfigService;

    return new AppVersionService(configService);
  }

  it('requires native update when current app tracking version is below minimum', () => {
    const service = createService();

    const result = service.checkVersion({
      appTrackingVersion: '1.0.0-20260528',
      platform: 'ios',
    });

    expect(result.updateRequired).toBe(true);
    expect(result.storeUrl).toBe('https://apps.apple.com/app/id0000000000');
  });

  it('allows app when tracking version is equal or above minimum', () => {
    const service = createService();

    expect(
      service.checkVersion({
        appTrackingVersion: '1.1.0-20260601',
        platform: 'android',
      }).updateRequired,
    ).toBe(false);
    expect(
      service.checkVersion({
        appTrackingVersion: '1.3.0-20260601',
        platform: 'android',
      }).updateRequired,
    ).toBe(false);
  });
});
