import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { compareAppTrackingVersions } from '../../common/utils/app-tracking-version.util';

interface CheckVersionInput {
  appTrackingVersion?: string;
  platform?: string;
}

export function compareAppVersions(left: string, right: string) {
  return compareAppTrackingVersions(left, right);
}

@Injectable()
export class AppVersionService {
  constructor(private readonly configService: ConfigService) {}

  checkVersion(input: CheckVersionInput) {
    const currentVersion = this.configService.getOrThrow<string>(
      'app.mobileAppCurrentVersion',
    );
    const minimumSupportedVersion = this.configService.getOrThrow<string>(
      'app.mobileAppMinimumVersion',
    );
    const appTrackingVersion =
      input.appTrackingVersion?.trim() || currentVersion;
    const updateRequired =
      compareAppVersions(appTrackingVersion, minimumSupportedVersion) < 0;

    return {
      appTrackingVersion,
      currentVersion,
      minimumSupportedVersion,
      platform: input.platform ?? null,
      storeUrl: this.resolveStoreUrl(input.platform),
      updateRequired,
    };
  }

  private resolveStoreUrl(platform?: string) {
    if (platform === 'ios') {
      return this.configService.getOrThrow<string>('app.mobileAppStoreUrl');
    }

    if (platform === 'android') {
      return this.configService.getOrThrow<string>('app.mobilePlayStoreUrl');
    }

    return null;
  }
}
