import { format, isValid, parse } from 'date-fns';

const DATE_SUFFIX_PATTERN = /^\d{8}$/;
const DATE_SUFFIX_PARSE_REFERENCE = new Date(2000, 0, 1);

export interface ParsedAppTrackingVersion {
  build: number[];
  core: number[];
}

/** Collapses optional spaces around the tracking separator (`3.1.2 - 20260601` → `3.1.2-20260601`). */
export function normalizeAppTrackingVersionInput(value: string) {
  return value.trim().replace(/\s*-\s*/, '-');
}

/**
 * Parses an 8-digit availability date suffix as YYYYMMDD (canonical) or DDMMYYYY.
 * Returns a normalized YYYYMMDD number for comparison, or null when not a valid date.
 */
export function parseAppTrackingDateSuffix(value: string) {
  const trimmed = value.trim();

  if (!DATE_SUFFIX_PATTERN.test(trimmed)) {
    return null;
  }

  const patterns = /^(19|20)\d{2}/.test(trimmed)
    ? (['yyyyMMdd', 'ddMMyyyy'] as const)
    : (['ddMMyyyy', 'yyyyMMdd'] as const);

  for (const pattern of patterns) {
    const parsed = parse(trimmed, pattern, DATE_SUFFIX_PARSE_REFERENCE);

    if (isValid(parsed)) {
      return Number.parseInt(format(parsed, 'yyyyMMdd'), 10);
    }
  }

  return null;
}

/**
 * Parses tracking versions `{semver}-{availabilityDate}`, e.g. `3.1.2-20260601`
 * or `3.1.2 - 20260601`. The suffix is the release/availability date, not a SemVer pre-release tag.
 */
export function parseAppTrackingVersion(
  value: string,
): ParsedAppTrackingVersion {
  const [coreValue = '', buildValue = ''] = normalizeAppTrackingVersionInput(
    value,
  ).split('-', 2);
  const buildDate = parseAppTrackingDateSuffix(buildValue);

  return {
    build:
      buildDate === null
        ? buildValue
            .split('.')
            .filter(Boolean)
            .map((part) => Number.parseInt(part, 10))
            .filter(Number.isFinite)
        : [buildDate],
    core: coreValue
      .split('.')
      .filter(Boolean)
      .map((part) => Number.parseInt(part, 10))
      .filter(Number.isFinite),
  };
}

function compareNumberParts(left: number[], right: number[]) {
  const length = Math.max(left.length, right.length);

  for (let index = 0; index < length; index += 1) {
    const leftPart = left[index] ?? 0;
    const rightPart = right[index] ?? 0;

    if (leftPart !== rightPart) {
      return leftPart > rightPart ? 1 : -1;
    }
  }

  return 0;
}

/** Returns -1, 0 or 1 (like `localeCompare` for sortable versions). */
export function compareAppTrackingVersions(left: string, right: string) {
  const leftVersion = parseAppTrackingVersion(left);
  const rightVersion = parseAppTrackingVersion(right);
  const coreComparison = compareNumberParts(
    leftVersion.core,
    rightVersion.core,
  );

  if (coreComparison !== 0) {
    return coreComparison;
  }

  return compareNumberParts(leftVersion.build, rightVersion.build);
}
