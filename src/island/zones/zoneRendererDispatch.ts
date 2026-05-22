import type { ZoneId } from '../../types/zone';

export type SupportedZoneRenderer = 'moongrove';

export function resolveZoneRenderer(
  zoneId: ZoneId
): SupportedZoneRenderer | null {
  if (zoneId === 'moongrove') {
    return 'moongrove';
  }
  return null;
}
