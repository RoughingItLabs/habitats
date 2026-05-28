import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ZONE_DEFINITIONS } from '../constants/zones';
import { getDemoZones } from '../island/demoIslandData';
import { isAppleHealthKitLinked } from '../health/appleHealthKit';
import {
  getHealthBridge,
  getHealthPlatformLabel,
} from '../health/getHealthBridge';
import {
  syncHealthData,
  type SyncHealthOutcome,
} from '../health/syncHealthData';
import { useHealthStore } from '../store/healthStore';
import { useIslandStore } from '../store/islandStore';

interface HealthSettingsSheetProps {
  visible: boolean;
  onClose: () => void;
}

function formatWhen(date: Date | string | null): string {
  if (!date) return 'Never';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return 'Never';
  return d.toLocaleString();
}

export function HealthSettingsSheet({
  visible,
  onClose,
}: HealthSettingsSheetProps) {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [outcome, setOutcome] = useState<SyncHealthOutcome | null>(null);

  const isHealthPermissionGranted = useHealthStore(
    s => s.isHealthPermissionGranted
  );
  const lastFetchedAt = useHealthStore(s => s.lastFetchedAt);
  const rawActivities = useHealthStore(s => s.rawActivities);
  const activitySummaries = useHealthStore(s => s.activitySummaries);
  const lastSynced = useIslandStore(s => s.lastSynced);

  const refreshAvailability = useCallback(async () => {
    const bridge = getHealthBridge();
    setAvailable(await bridge.isAvailable());
  }, []);

  useEffect(() => {
    if (visible) {
      setOutcome(null);
      refreshAvailability();
    }
  }, [visible, refreshAvailability]);

  const runSync = async (requestPermission: boolean) => {
    setLoading(true);
    setOutcome(null);
    try {
      const result = await syncHealthData(requestPermission);
      setOutcome(result);
      await refreshAvailability();
    } catch (e) {
      setOutcome({
        status: 'error',
        message: e instanceof Error ? e.message : 'Sync failed unexpectedly.',
        activityCount: 0,
        summaryCount: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const restoreDemoIsland = () => {
    const demoZones = getDemoZones();
    useIslandStore.setState(state => ({
      zones: { ...state.zones, ...demoZones },
      lastSynced: null,
    }));
    setOutcome({
      status: 'success',
      message: 'Demo island zones restored.',
      activityCount: rawActivities.length,
      summaryCount: activitySummaries.length,
    });
  };

  const platformLabel = getHealthPlatformLabel();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.container,
          { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 16 },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Health sync (test)</Text>
          <Pressable onPress={onClose} hitSlop={12}>
            <Text style={styles.close}>Done</Text>
          </Pressable>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.card}>
            <Row label="Platform" value={`${Platform.OS} · ${platformLabel}`} />
            <Row
              label="Native module"
              value={
                Platform.OS === 'ios'
                  ? isAppleHealthKitLinked()
                    ? 'Linked'
                    : 'Not linked — rebuild dev client'
                  : 'N/A'
              }
            />
            <Row
              label="Available"
              value={
                available === null
                  ? 'Checking…'
                  : available
                    ? 'Yes'
                    : 'No'
              }
            />
            <Row
              label="Permissions"
              value={isHealthPermissionGranted ? 'Granted' : 'Not granted'}
            />
            <Row label="Last fetch" value={formatWhen(lastFetchedAt)} />
            <Row label="Island synced" value={formatWhen(lastSynced)} />
            <Row label="Raw records" value={String(rawActivities.length)} />
          </View>

          {available === false && Platform.OS === 'android' && (
            <Pressable
              style={styles.secondaryButton}
              onPress={() => {
                const { openHealthConnectSettings } =
                  require('react-native-health-connect') as typeof import('react-native-health-connect');
                openHealthConnectSettings();
              }}
            >
              <Text style={styles.secondaryButtonText}>
                Open Health Connect settings
              </Text>
            </Pressable>
          )}

          <Pressable
            style={[styles.primaryButton, loading && styles.buttonDisabled]}
            disabled={loading}
            onPress={() => runSync(true)}
          >
            {loading ? (
              <ActivityIndicator color="#E8D8FF" />
            ) : (
              <Text style={styles.primaryButtonText}>
                Connect & sync (14 days)
              </Text>
            )}
          </Pressable>

          <Pressable
            style={[styles.secondaryButton, loading && styles.buttonDisabled]}
            disabled={loading || !isHealthPermissionGranted}
            onPress={() => runSync(false)}
          >
            <Text style={styles.secondaryButtonText}>Sync again</Text>
          </Pressable>

          <Pressable style={styles.ghostButton} onPress={restoreDemoIsland}>
            <Text style={styles.ghostButtonText}>Restore demo island</Text>
          </Pressable>

          {outcome && (
            <View
              style={[
                styles.banner,
                outcome.status === 'success'
                  ? styles.bannerSuccess
                  : styles.bannerError,
              ]}
            >
              <Text style={styles.bannerText}>{outcome.message}</Text>
            </View>
          )}

          {activitySummaries.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Zone levels from health</Text>
              {activitySummaries.map(summary => {
                const zone = Object.values(ZONE_DEFINITIONS).find(
                  z => z.activityType === summary.type
                );
                return (
                  <View key={summary.type} style={styles.summaryRow}>
                    <Text style={styles.summaryName}>
                      {zone?.name ?? summary.type}
                    </Text>
                    <Text style={styles.summaryMeta}>
                      {(summary.level * 100).toFixed(0)}% · {summary.recentValue}{' '}
                      · {summary.trend}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}

          {rawActivities.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Recent daily records</Text>
              {rawActivities
                .slice()
                .sort((a, b) => b.date.localeCompare(a.date))
                .slice(0, 12)
                .map((a, i) => (
                  <Text key={`${a.date}-${a.type}-${i}`} style={styles.rawLine}>
                    {a.date} · {a.type}: {Math.round(a.value)} {a.unit}
                  </Text>
                ))}
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1030',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  title: {
    color: '#E8D8FF',
    fontSize: 20,
    fontWeight: '700',
  },
  close: {
    color: '#C4B5D9',
    fontSize: 16,
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 12,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#2a1848',
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  rowLabel: {
    color: '#A89BC4',
    fontSize: 14,
  },
  rowValue: {
    color: '#E8D8FF',
    fontSize: 14,
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'right',
  },
  sectionTitle: {
    color: '#E8D8FF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  primaryButton: {
    backgroundColor: '#6A4AAA',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#E8D8FF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#4A3A7A',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#E8D8FF',
    fontSize: 15,
    fontWeight: '600',
  },
  ghostButton: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  ghostButtonText: {
    color: '#A89BC4',
    fontSize: 14,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  banner: {
    borderRadius: 12,
    padding: 12,
  },
  bannerSuccess: {
    backgroundColor: '#2A4A3A',
  },
  bannerError: {
    backgroundColor: '#4A2A3A',
  },
  bannerText: {
    color: '#E8D8FF',
    fontSize: 14,
    lineHeight: 20,
  },
  summaryRow: {
    gap: 2,
  },
  summaryName: {
    color: '#E8D8FF',
    fontSize: 15,
    fontWeight: '600',
  },
  summaryMeta: {
    color: '#A89BC4',
    fontSize: 13,
  },
  rawLine: {
    color: '#C4B5D9',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});
