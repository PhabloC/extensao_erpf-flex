import {
  compareAppTrackingVersions,
  normalizeAppTrackingVersionInput,
  parseAppTrackingDateSuffix,
  parseAppTrackingVersion,
} from './app-tracking-version.util';

describe('normalizeAppTrackingVersionInput', () => {
  it('removes spaces around the separator', () => {
    expect(normalizeAppTrackingVersionInput('3.1.2 - 20260601')).toBe(
      '3.1.2-20260601',
    );
  });
});

describe('parseAppTrackingDateSuffix', () => {
  it('parses YYYYMMDD availability dates', () => {
    expect(parseAppTrackingDateSuffix('20260601')).toBe(20260601);
  });
});

describe('parseAppTrackingVersion', () => {
  it('parses semver and YYYYMMDD with optional spaces', () => {
    expect(parseAppTrackingVersion('3.1.2 - 20260601')).toEqual({
      core: [3, 1, 2],
      build: [20260601],
    });
  });
});

describe('compareAppTrackingVersions', () => {
  it('compares core semver and availability date suffix', () => {
    expect(compareAppTrackingVersions('3.1.2-20260601', '3.1.2-20260601')).toBe(
      0,
    );
    expect(
      compareAppTrackingVersions('3.1.2 - 20260601', '3.1.2-20260602'),
    ).toBe(-1);
    expect(compareAppTrackingVersions('3.2.0-20260601', '3.1.9-20261231')).toBe(
      1,
    );
  });

  it('still accepts legacy DDMMYYYY suffixes', () => {
    expect(compareAppTrackingVersions('1.0.0-28052026', '1.0.0-20260528')).toBe(
      0,
    );
  });
});
