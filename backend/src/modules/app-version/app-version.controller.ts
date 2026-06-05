import { Controller, Get, Headers } from '@nestjs/common';

import { AppVersionService } from './app-version.service';

@Controller('app/versions')
export class AppVersionController {
  constructor(private readonly appVersionService: AppVersionService) {}

  @Get('check')
  checkVersion(
    @Headers('x-app-platform') platform?: string,
    @Headers('x-app-tracking-version') appTrackingVersion?: string,
  ) {
    return this.appVersionService.checkVersion({
      appTrackingVersion,
      platform,
    });
  }
}
