import { ZONE_DEFINITIONS } from '../constants/zones';
import type { ZoneData, ZoneId } from '../types/zone';

const ZONE_IDS = Object.keys(ZONE_DEFINITIONS) as ZoneId[];

/** Zones present in state, in stable definition order (for Prompt 4 render pass). */
export function getZonesToRender(
  zones: Partial<Record<ZoneId, ZoneData>>
): ZoneData[] {
  return ZONE_IDS.map(id => zones[id]).filter(
    (zone): zone is ZoneData => zone != null
  );
}
