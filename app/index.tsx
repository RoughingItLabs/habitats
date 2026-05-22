import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IslandCanvas } from '../src/island/IslandCanvas';
import {
  DEMO_CREATURES,
  DEMO_ISLAND_SCALE,
  getDemoZones,
} from '../src/island/demoIslandData';
import { useCreatureStore } from '../src/store/creatureStore';
import { useIslandStore } from '../src/store/islandStore';

export default function IslandScreen() {
  const insets = useSafeAreaInsets();
  const zones = useIslandStore(state => state.zones);
  const islandScale = useIslandStore(state => state.islandScale);
  const setIslandScale = useIslandStore(state => state.setIslandScale);
  const creatures = useCreatureStore(state => state.creatures);

  useEffect(() => {
    const demoZones = getDemoZones();
    useIslandStore.setState({
      zones: { ...useIslandStore.getState().zones, ...demoZones },
      islandScale: DEMO_ISLAND_SCALE,
    });

    if (useCreatureStore.getState().creatures.length === 0) {
      DEMO_CREATURES.forEach(creature =>
        useCreatureStore.getState().addCreature(creature)
      );
    }
  }, []);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <IslandCanvas
        zones={zones}
        islandScale={islandScale}
        creatures={creatures}
      />
      <View style={[styles.controls, { paddingBottom: insets.bottom + 12 }]}>
        <Pressable
          style={styles.button}
          onPress={() => setIslandScale(Math.max(0.75, islandScale - 0.05))}
        >
          <Text style={styles.buttonText}>Zoom −</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => setIslandScale(Math.min(1.1, islandScale + 0.05))}
        >
          <Text style={styles.buttonText}>Zoom +</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1a1030',
  },
  controls: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  button: {
    backgroundColor: '#4A3A7A88',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  buttonText: {
    color: '#E8D8FF',
    fontSize: 14,
    fontWeight: '600',
  },
});
