import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, AppState } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

const MINT_COLOR = '#66C5BA';

const SOUND_ASSETS = {
  rain: require('../../../../assets/sounds/soft_rain.mp3'),
  waves: require('../../../../assets/sounds/waves.mp3'),
  zen: require('../../../../assets/sounds/zen.mp3'),
  hz52: require('../../../../assets/sounds/meditation.mp3'),
};

const SOUND_OPTIONS = [
  { id: 'rain', title: 'Tiếng Mưa', icon: 'rainy-outline', asset: SOUND_ASSETS.rain },
  { id: 'waves', title: 'Sóng Biển', icon: 'water', asset: SOUND_ASSETS.waves },
  { id: 'zen', title: 'Thiền Định', icon: 'leaf', asset: SOUND_ASSETS.zen },
  { id: 'hz52', title: 'Tần Số 52Hz', icon: 'radio', asset: SOUND_ASSETS.hz52 },
];

export default function AudioPlayer() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
  }, []);

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setPlayingId(null);
    }
  };

  const playSound = async (id: string, asset: any) => {
    try {
      if (playingId === id && sound) {
        await stopSound();
        return;
      }
      
      await stopSound();

      const { sound: newSound } = await Audio.Sound.createAsync(
        asset,
        { isLooping: true, shouldPlay: true }
      );
      setSound(newSound);
      setPlayingId(id);
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/active/) && nextAppState === 'background') {
        if (sound) {
          sound.pauseAsync();
        }
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [sound]);

  return (
    <View style={styles.audioGrid}>
      {SOUND_OPTIONS.map((item) => {
        const isPlaying = playingId === item.id;
        return (
          <TouchableOpacity
            key={item.id}
            style={[styles.audioCard, isPlaying && styles.audioCardActive]}
            onPress={() => playSound(item.id, item.asset)}
            activeOpacity={0.8}
          >
            <View style={[styles.iconCircle, isPlaying && styles.iconCircleActive]}>
              <Ionicons name={item.icon as any} size={28} color={isPlaying ? '#FFF' : MINT_COLOR} />
            </View>
            <Text style={[styles.audioTitle, isPlaying && styles.audioTitleActive]}>{item.title}</Text>
            {isPlaying && (
              <View style={styles.playingIndicator}>
                <View style={styles.dot} />
                <Text style={styles.playingText}>Đang phát</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  audioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  audioCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  audioCardActive: {
    borderColor: MINT_COLOR,
    backgroundColor: '#F4FBF9',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircleActive: {
    backgroundColor: MINT_COLOR,
  },
  audioTitle: {
    fontSize: 15,
    fontFamily: 'Baloo2_600SemiBold',
    color: '#333',
    textAlign: 'center',
  },
  audioTitleActive: {
    color: MINT_COLOR,
  },
  playingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: MINT_COLOR,
    marginRight: 4,
  },
  playingText: {
    fontSize: 12,
    fontFamily: 'Baloo2_500Medium',
    color: MINT_COLOR,
  },
});
