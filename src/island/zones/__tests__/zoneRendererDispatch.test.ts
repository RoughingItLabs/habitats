import { resolveZoneRenderer } from '../zoneRendererDispatch';

describe('resolveZoneRenderer', () => {
  it('returns moongrove for the moongrove zone', () => {
    expect(resolveZoneRenderer('moongrove')).toBe('moongrove');
  });

  it('returns null for zones without a Skia renderer yet', () => {
    expect(resolveZoneRenderer('meadow')).toBeNull();
    expect(resolveZoneRenderer('embertrail')).toBeNull();
    expect(resolveZoneRenderer('stonepeak')).toBeNull();
  });
});
